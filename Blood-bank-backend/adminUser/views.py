from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor,Calender
from recipient.models import Recipient,FirstDonationDetails
from adminUser.models import LeaderBoard
from django.http import JsonResponse
import json
from datetime import datetime,timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from django.views.decorators.csrf import csrf_exempt
import pyotp
import time
from sms import send_sms
from twilio.rest import Client
from django.core.serializers import serialize
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.core.files.storage import FileSystemStorage


from smtplib import SMTPException
import random
from django.conf import settings
import uuid
import jwt
import pytz
from django.core.mail import send_mail

# Create your views here.


key = settings.SECRET_KEY

#ADMIN API's

#Base URL form image store and get
base_url = 'http://192.168.29.55:8000'


#Get all matched donors and recipients
def authorize_admin(request):
    
    username  =  request.user
    user  = User.objects.filter(username = username).first()
    if user == None or user.is_superuser == False:
        return False
def generate_otp():
    return str(random.randint(100000, 999999))


#completed
@csrf_exempt
def get_donor_list(request):
    if (request.method =='GET'):
        # phoneNumber = request.session.get('member_id')
        # print(phoneNumber)
        # if phoneNumber is None:
        #     return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:

           
            current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
            current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
            three_months_ago = current_date - timedelta(days=3*30)
            print(three_months_ago)
            # donor_list_obj  = Donor.objects.filter(Q(lastDonated__lte=three_months_ago) | Q(lastDonated__isnull=True)).all()
            donor_list_obj  = Donor.objects.all()
            donor_list_data = []
            sl = 1
            if donor_list_obj:
                donor_list_data = [{
                                    'sl': index + 1,
                                    'id': donor.id, 
                                    'loan' : donor.loan,
                                    'lastDonated': donor.lastDonated, 
                                    'firstName': donor.firstName,
                                    'lastName': donor.lastName,
                                    'thalassemia' : donor.isThalassemia,
                                    'bloodGroup' : donor.bloodGroup,
                                    'email' : donor.email,
                                    'registeredByAdmin' : donor.registeredByAdmin,
                                    'phoneNumber' : donor.phoneNumber,
                                    'address' : donor.address,
                                    'gender' : donor.gender,
                                    'isAvailable' : (True if (donor.lastDonated== None) else donor.lastDonated <= three_months_ago),
                                    'totalDonation' : donor.totalDonation,
                                    'registrationDate' : donor.registrationDate
                                    } for index, donor in enumerate(donor_list_obj)]
            
        

            return JsonResponse({'success' : 'returned successsfully', 'donor_list' : donor_list_data},safe=False ,status =200)
                
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
        
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm donor-recipient pair

@csrf_exempt
def confirm_donor(request,donor_id):
    if request.method=="GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
         
        # body  = json.loads(request.body)
        # id  = body['donor_id'] 
        donor_id = uuid.UUID(donor_id)
        current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
        three_months_ago = current_date - timedelta(days=3*30)
        try:

            donor = Donor.objects.filter(Q(id = donor_id)& (Q(lastDonated__lte=three_months_ago) | Q(lastDonated = None))).first()
            if not donor:
                return JsonResponse({'error' : 'Donor is not Eligible for Donation'},status=500)
            dateObj = datetime.now(tz=pytz.timezone('Asia/Kolkata'))
            iso_format = "%Y-%m-%d"
            date  = datetime.strftime(dateObj, iso_format)
            donor.lastDonated = date
            donor.totalDonation += 1
            if donor.loan : 
                donor.loan = False
            donor.save()

          

        except Exception as e:
            print(e)
            return JsonResponse({"error":"Donation Confirmation Failed"},status=500)
       
        try: 
            if donor.registeredByAdmin == False:
                message = "Hi "+ donor.firstName + ", " + "\nThank You for your Blood Donation."
                subject = 'Blood Needed Urgently'
                send_mail(
                    subject,
                    message,
                    'support@smileorganization.in',
                    [donor.email],
                    fail_silently=False,
                    )

            return JsonResponse({"success" : "Comfirmation Done Successfully"},status=200)
        
            
            
        except Exception as e:
            print(e) 
            pass

        
    return JsonResponse({"error" : "Invalid request method"},status = 400)


#get confirmed pair list

@csrf_exempt
def get_recipient_list(request):
    if (request.method =='GET'):
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:
            current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date()
            recipientList = Recipient.objects.filter(requestDate = current_date_string).all()
            print(recipientList.values())
            recipient_list_data=[]
            sl = 1
            if len(recipientList) != 0:
                for recipient in recipientList:
                    firstDonation={}
                    if recipient.firstDonation:
                        firstDonation = {
                                            'donBlood' : recipient.firstDonation.donBlood,
                                            'bloodBankName':recipient.firstDonation.bloodBankName,
                                            'donorName':recipient.firstDonation.donorName,
                                            'donationDate':recipient.firstDonation.donationDate,
                                            'donationReceipt': base_url + recipient.firstDonation.donationReceipt.url
                                        }
                    recipient_list_data.append({'id': recipient.id,  
                                                'sl' : sl,
                                        'firstName': recipient.firstName,
                                        'lastName': recipient.lastName,
                                        'isThalassemia' : recipient.isThalassemia,
                                        'hasCancer' : recipient.hasCancer,
                                        'hospitalName' : recipient.hospitalName,
                                        'firstDonation' : firstDonation,
                                        'firstDonCheck' : recipient.firstDonCheck,
                                        'bloodGroup' : recipient.bloodGroup,
                                        'phoneNumber' : recipient.phoneNumber,
                                        'gender' : recipient.gender,
                                        'address' : recipient.address,
                                        'status' : recipient.status,
                                        })
                    sl+=1
            return JsonResponse({'success' : 'returned successsfully', 'list' : recipient_list_data},status =200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Failed"},status=500)
    return JsonResponse({"error" : "Invalid request Method"}, status=400)

#confirm Donation

@csrf_exempt
def confirmRecipientDonation(request,recipient_id):
    if request.method == "GET" : 
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        # body  = json.loads(request.body)
        # id  = body['recipient_id'] 
        recipient_id = uuid.UUID(recipient_id) 
        try:
            recipient = Recipient.objects.filter(id = recipient_id).first()
            recipient.status = "Confirmed"
            recipient.save()
            return JsonResponse({"status" : "Request approved successfully"},status=200)

        except Exception as e:
            return JsonResponse({"error" : e},status =500)
        
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)

@csrf_exempt
def reject_request(request,recipient_id):
    if request.method == "GET" : 
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        # body  = json.loads(request.body)
        # recipient_id = body['recipient_id']
        recipient_id = uuid.UUID(recipient_id) 
        try:
            recipient = Recipient.objects.filter(id = recipient_id).first()
            recipient.status = "Rejected"
            recipient.save()
            dayQuantity = Calender.objects.first()
            dayQuantity.quantity+=1
            dayQuantity.save()
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something Went wrong"},status =500)
        return JsonResponse({"status" : "Successfully rejected the request"},status = 200)
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)





@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        body = json.loads(request.body)
        
        username = body['username']
        password = body['password']
        # print(username)
        # print(password)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        # print(user)
        
        try: 
            if user is not None:
                # Log in the authenticated user
                login(request, user)
                request.session.set_expiry(24*60*60)

                is_staff = user.is_superuser
                #newline update

                isAdmin = jwt.encode({'isAdmin': is_staff}, key, algorithm='HS256')
                print(isAdmin)
                print(request.user)
                # for it in request.session:
                #     print(it)
                    
                
                return JsonResponse({'success': 'Admin Login Successful','is_Admin' : isAdmin},status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'},status=403)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something Went Wrong"},status =500)
    
    return JsonResponse({'error':'Invalid Request'},status = 400)

@csrf_exempt
def admin_logout(request):
    logout(request)
   
    return JsonResponse({"success": "Admin logout processed"},status=200)


@csrf_exempt
def requirement_msg(request, donor_id):
    if request.method == "GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        donor_id = uuid.UUID(donor_id)
        donor = get_object_or_404(Donor, id=donor_id)
        email = donor.email
        current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
        three_months_ago = current_date - timedelta(days=3*30)
        if (donor.lastDonated is not None) and donor.lastDonated >three_months_ago :
            return JsonResponse({"error" : "Donor not eligible for Donation"}, status=500)
        try: 
            if donor.registeredByAdmin == False:
                message = "Hi "+ donor.firstName + ", " + "\nThere is an urgent need of blood. Kindly visit or contact SMILE admin"
                subject = 'Blood Needed Urgently'
                send_mail(
                    subject,
                    message,
                    'support@smileorganization.in',
                    [email],
                    fail_silently=False,
                    )

            return JsonResponse({"success" : "SMS sent successfully"},status=200)
            
        except Exception as e:
            print(e) 
            return JsonResponse({'error' : 'SMS not sent'}, status =500)
    return JsonResponse({'error' :'Invalid request method'} , status=400)
        

@csrf_exempt
def loan_msg(request, donor_id):
    if request.method == "GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        donor_id = uuid.UUID(donor_id)
        # donor = get_object_or_404(Donor, id=donor_id, loan=True)
        donor= Donor.objects.filter(id = donor_id).first()
        print(donor.firstName)
        if donor.loan == False : 
            return JsonResponse({"error" : "Donor doesn't have any existing loan"},status = 500)
        try: 
            if donor.registeredByAdmin == False:
                message = "Hi "+ donor.firstName + ", " + "\nThere is a pending blood loan against your id, Kindly visit SMILE or contact admin to donate blood."
                subject = 'Loan Pending'
                send_mail(
                    subject,
                    message,
                    'support@smileorganization.in',
                    [donor.email],
                    fail_silently=False,
                    )

            return JsonResponse({"success" : "SMS sent successfully"},status=200)
            
        except Exception as e:
            print(e) 
            return JsonResponse({'error' : 'SMS not sent'}, status =500)
    return JsonResponse({'error' :'Invalid request method'} , status=400)     


@csrf_exempt
def confirm_loan(request, donor_id):
    if request.method=="GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
         
        donor_id = uuid.UUID(donor_id)
        try:

            donor = Donor.objects.filter(id = donor_id).first()
            if donor.loan :
                return  JsonResponse({"error":"Loan already taken"},status=500)
            donor.loan = True
            donor.save()

          

        except Exception as e:
            print(e)
            return JsonResponse({"error":"Donation Confirmation Failed"},status=500)
       
        try: 
            
            if donor.registeredByAdmin == False:
                message = f'Hi '+ donor.firstName + ',' + '\nYour Loan Request for 1 unit blood has been processed.'
                subject = 'Loan Confirmed'
                send_mail(
                    subject,
                    message,
                    'support@smileorganization.in',
                    [donor.email],
                    fail_silently=False,
                    )

            return JsonResponse({"success" : "Comfirmation Done Successfully"},status=200)
            
        except Exception as e:
            print(e) 
            pass

        
    return JsonResponse({"error" : "Invalid request method"},status = 400)

@csrf_exempt
def addPhotos(request):
    if request.method == 'POST':
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
         
        images = request.FILES.getlist('images')
        print(images)

        if len(images) != 5 :
            return JsonResponse({"error" : "Exactly 5 images allowed"},status=500)
   

        leaderBoards = LeaderBoard.objects.all()
       
        if leaderBoards is not None: 
            for leaderBoard in leaderBoards:
                print('HI DELETE')
                leaderBoard.p1.delete(save=False)
                leaderBoard.p2.delete(save=False)
                leaderBoard.p3.delete(save=False)
                leaderBoard.p4.delete(save=False)
                leaderBoard.p5.delete(save=False)

                leaderBoard.delete()
        try:
            LeaderBoard(
                p1 = images[0],
                p2 = images[1],
                p3 = images[2],
                p4 = images[3],
                p5 = images[4]
            ).save()
          
            # file_name1= fs.save(p1.name,p1)
            # file_url1 = fs.url(file_name1)
            # file_name2 = fs.save(p2.name,p2)
            # file_url2 = fs.url(file_name2)
            # file_name3 =fs.save(p3.name,p3)
            # file_url3 = fs.url(file_name3)
            # file_name4 =fs.save(p4.name,p4)
            # file_url4 = fs.url(file_name4)
            # file_name5 =fs.save(p5.name, p5)  
            # file_url5 = fs.url(file_name5)
        except Exception as e:
            print(e)
            return JsonResponse( {"error": str(e)}, status=500)
        return JsonResponse({'success' : 'Images added successfully'},status=200)

    return JsonResponse({"error" : "Invalid request method"},status = 400)

@csrf_exempt
def  getLeaderboardImage(request):
    if request.method == 'GET':
        leaderboard = LeaderBoard.objects.first()
        
        data = {
            'image1' : base_url+leaderboard.p1.url,
            'image2' : base_url+leaderboard.p2.url,
            'image3' : base_url+ leaderboard.p3.url,
            'image4' : base_url+ leaderboard.p4.url,
            'image5' : base_url+ leaderboard.p5.url,


        }
        
        
        return JsonResponse({'success' : 'Images loaded successfully', 'data' : data},status=200)
    return JsonResponse({"error" : "Invalid request method"},status = 400)   

@csrf_exempt
def getFirstDon(request, recipient_id):
    if request.method == 'GET':
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        try:
            recipient_id= uuid.UUID(recipient_id)
            recipient = Recipient.objects.filter(id = recipient_id).first()
            if recipient:
                if  not recipient.firstDonCheck:
                    return JsonResponse({'firstDonation' : {
                                            'donBlood' : recipient.firstDonation.donBlood,
                                            'bloodBankName':recipient.firstDonation.bloodBankName,
                                            'donorName':recipient.firstDonation.donorName,
                                            'donationDate':recipient.firstDonation.donationDate,
                                            'donationReceipt': base_url + recipient.firstDonation.donationReceipt.url
                                        }}, status= 200)

                else:
                    return JsonResponse({"error" : "No details available"},status=400)
            else:
                return JsonResponse({"error":"Invaild recipient Id"},status=400)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something Went Wrong"},status=500)
    return JsonResponse({"error" : "Invalid Request Method"},status=400)   

@csrf_exempt
def admin_request_blood(request):
    if request.method == "POST" : 

        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
            
        username = request.user
        user  = User.objects.filter(username = username).first()
        email = user.email
        
         
        firstName = request.POST.get('firstName')
        lastName = request.POST.get('lastName')
        dob = request.POST.get('dob')
       
        phoneNumber = request.POST.get('phoneNumber')
        address = request.POST.get('address')
        bloodGroup = request.POST.get('bloodGroup')
        hospitalName = request.POST.get('hospitalName')
        isThalassemia = request.POST.get('isThalassemia').lower().capitalize() == "True"
        hasCancer = request.POST.get('hasCancer').lower().capitalize() == "True"

      
        gender = request.POST.get('gender')
        # donationReceipt = request.POST.get('donationReceipt')
        firstDonCheck = True
        # dateString = body['date']
        date_format = '%Y-%m-%d'
        
        
        birthDateObj = datetime.strptime(dob, date_format)

        dayQuantity = Calender.objects.first()
        if dayQuantity.quantity <= 0:
            return JsonResponse({"error":"Currently no slot available for booking!"},status=500)


        current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()

        try:
            recipient = Recipient.objects.filter(phoneNumber = phoneNumber,status__in = ['Confirmed' ,'Pending'],registeredByAdmin =True).order_by("-requestDate").first()
            if recipient is not None:
                #lastRecieved = datetime.datetime.strptime(recipient.date,"%Y-%m-%d").date()
                print((current_date.year - recipient.requestDate.year)*365 +( current_date.month-recipient.requestDate.month)*30 + (current_date.day - recipient.requestDate.day))
                if (current_date.year - recipient.requestDate.year)*365 +( current_date.month-recipient.requestDate.month)*30 + (current_date.day - recipient.requestDate.day) <15:
                    return JsonResponse({"error" : "Cannot place request withing 15 days of last recieved"},status = 400)
            print('HI')
            
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something went wrong"},status = 400)
        
        
       
        firstDonation = FirstDonationDetails().save()
            # fs = FileSystemStorage()

            # # save the image on MEDIA_ROOT folder
            # file_name = fs.save(image_file.name, image_file)

            # # get file url with respect to `MEDIA_URL`
            # file_url = fs.url(file_name)
            # print(file_url)



        try:
           
            new_recipient = Recipient(
            firstName = firstName,
            lastName = lastName,
            dob = birthDateObj.date(),
            bloodGroup = bloodGroup,
            phoneNumber = phoneNumber,
            
            email = email,
            address = address,
            requestDate = current_date,
            hospitalName = hospitalName,
            isThalassemia = isThalassemia,
            hasCancer  = hasCancer,
            firstDonCheck = firstDonCheck,
            firstDonation = firstDonation,
            gender=gender,
            registeredByAdmin = True
            )
            new_recipient.save()
            
            dayQuantity.quantity-=1
            dayQuantity.save()
            return JsonResponse({"success" : "Request Placed Successfully"},status=201)



          
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'error while saving form'},status=500)
        


        
    return JsonResponse({"error" : "Invalid request method"},status =400)

@csrf_exempt
def admin_registerDonor(request) :
    if request.method == "POST":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized"},status = 401)
        
        username = request.user
        user  = User.objects.filter(username = username).first()
        email = user.email

        body = json.loads(request.body)
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        bloodGroup = body['bloodGroup']
        phoneNumber = body['phoneNumber']
        #otp = body['otp']
        address = body['address']
        gender = body['gender']
        lastDonated = body['lastDonated']
        isThalassemia = body['isThalassemia']
    
        isDonor = Donor.objects.filter(phoneNumber = phoneNumber).first()
        if isDonor is not None:
            return JsonResponse({"error":"PhoneNumber Already Exists for another Donor"},status=409)

        

        date_format = '%Y-%m-%d'
        id=str(uuid.uuid4())
        print(id)
        print(dob)
        date_obj = datetime.strptime(dob, date_format)
        current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
        # isDonor2 = Donor.objects.filter(firstName = firstName , lastName = lastName , bloodGroup = bloodGroup ,dob =date_obj.date()).first()
        # if isDonor2 is not None : 
        #     return JsonResponse({"error" : "Kindly contact admin as you are already registered as a donor"},status=400)
        


        try:
            new_donor = Donor(
                firstName = firstName,
                lastName = lastName,
                dob = date_obj.date(),
                bloodGroup = bloodGroup,
                phoneNumber = phoneNumber,
                email = email,
                address = address,
                gender = gender,
                id = id,
                lastDonated=lastDonated,
                isThalassemia = isThalassemia,
                registeredByAdmin = True,
                registrationDate = current_date

            )
            new_donor.save()
            
         
            
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'While regestering'},status=500)
        
        
        return JsonResponse({"success" : "Donor Registered Successfully"},status = 200)
    return JsonResponse({"error" : "Invalid request method"},status =400)

@csrf_exempt
def updateEmail(request):
    if request.method == "GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized" },status=401)
        email = request.GET.get('email')
        donor_id = request.GET.get('donor_id')

        donor = Donor.objects.filter(id = donor_id).first()
        if(donor is not None) : 
            donor.email = email
            donor.save()
            return JsonResponse({"success" : "Email has been updated successfully"},status =201)
        else:
            return JsonResponse({"error" : "Donor donot exist"},status=400)
        
    return JsonResponse({"error" : "Invalid request method"},status =400)

@csrf_exempt
def remove_donor(request,donor_id):
    if request.method == "GET":
        if authorize_admin(request) == False:
            return JsonResponse({"error" : "Unauthorized" },status=401)
        
        try:
            Donor.objects.filter(id=donor_id).delete()
            return JsonResponse({"status" : "Donor deleted successfully"},status = 200)
        except Exception as e:
            return JsonResponse({"error" : "Something went wrong"},status=500)
    
    return JsonResponse({"error" : "Invalid request method"}, status=400)