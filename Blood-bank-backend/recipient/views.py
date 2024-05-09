from django.shortcuts import render
import json

import datetime
from recipient.models import Recipient,FirstDonationDetails
from donor.models import Donor,Calender
from django.http import JsonResponse
import datetime
import pytz
import uuid
from twilio.rest import Client
from sms import send_sms
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail


#matchpair view

# def matchpair(donor,new_recipient,date):
    
#     matched_donor = MatchedDonor(recipient=new_recipient.id, donor=donor.id,date=date)
#     matched_donor.save()
#     dateObj = Calender.objects.filter(date = date).first()
#     print(dateObj)
#     if dateObj:
#         if dateObj.quantity <=0:
#             print(dateObj.quantity)
#             return JsonResponse({"error" : "Dates Not available "},status = 400)
#         dateObj.quantity -= 1
#         dateObj.save()

#     try:

#         client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
#         # Replace 'to' with the recipient's phone number
#         to = donor.phoneNumber
        
        
#         # Replace 'from_' with your Twilio phone number
#         from_ = settings.TWILIO_PHONE_NUMBER
        
#         message = client.messages.create(
#             body="Hi "+ donor.firstName + " , Someone Urgently needs blood of group "+ donor.bloodGroup +"\n Kindly contact to our NGO ASAP", 
#             to=to,
#             from_=from_
#         )

#         return JsonResponse({"success" : "Request Placed Successfully"},status =201)   
#     except:
#         return JsonResponse({"success" : "Request Placed Successfully"},status =201)   

    

# Create your views here.
@csrf_exempt
def request_blood(request):
    if request.method == "POST" : 

        email = request.session.get('member_id')
        if email is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        print(email)
         
        firstName = request.POST.get('firstName')
        lastName = request.POST.get('lastName')
        dob = request.POST.get('dob')
        #email = request.POST.get('email')
        phoneNumber = request.POST.get('phoneNumber')
        address = request.POST.get('address')
        bloodGroup = request.POST.get('bloodGroup')
        hospitalName = request.POST.get('hospitalName')
        isThalassemia = request.POST.get('isThalassemia').lower().capitalize() == "True"
        hasCancer = request.POST.get('hasCancer').lower().capitalize() == "True"
        print(hasCancer)
        donBlood = request.POST.get('donBlood')
        bloodBankName = request.POST.get('bloodBankName')
        donorName = request.POST.get('donorName')
        donationDate = request.POST.get('donationDate')
        gender = request.POST.get('gender')
        # donationReceipt = request.POST.get('donationReceipt')
        firstDonCheck = request.POST.get('firstDonCheck').lower().capitalize() == "True"
        # dateString = body['date']
        date_format = '%Y-%m-%d'
        
        image_file = request.FILES.get('donationReceipt')
        birthDateObj = datetime.datetime.strptime(dob, date_format)


        dayQuantity = Calender.objects.first()
        if dayQuantity.quantity <= 0:
            return JsonResponse({"error":"Currently no slot available for booking!"},status=500)


        current_date_string= datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.datetime.strptime(current_date_string, "%Y-%m-%d").date()

        try:
            recipient = Recipient.objects.filter(email=email,status__in = ['Confirmed' ,'Pending']).order_by("-date").first()
            if recipient is not None:
                #lastRecieved = datetime.datetime.strptime(recipient.date,"%Y-%m-%d").date()
                print((current_date.year - recipient.date.year)*365 +( current_date.month-recipient.date.month)*30 + (current_date.day - recipient.date.day))
                if (current_date.year - recipient.date.year)*365 +( current_date.month-recipient.date.month)*30 + (current_date.day - recipient.date.day) <15:
                    return JsonResponse({"error" : "Cannot place request withing 15 days of last recieved"},status = 400)
            
            
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something went wrong"},status = 400)
        
        
        if firstDonCheck :
            firstDonation = FirstDonationDetails().save()
            if hasCancer == True or isThalassemia == True or (bloodGroup in ['A-', 'B-','AB-','O-']):
                pass
            else :
                return JsonResponse({"error" : "First Donation Validation Error"},status=500)
        else:
            firstDonation = FirstDonationDetails(
                donBlood = donBlood,
                bloodBankName = bloodBankName,
                donorName = donorName,
                donationDate = datetime.datetime.strptime(donationDate,date_format).date(),
                donationReceipt = image_file
            )
            firstDonation.save()
            fs = FileSystemStorage()

            # save the image on MEDIA_ROOT folder
            file_name = fs.save(image_file.name, image_file)

            # get file url with respect to `MEDIA_URL`
            file_url = fs.url(file_name)
            print(file_url)

        
        
        
        
        
        
      
        
       

        
         

        try:
           
            new_recipient = Recipient(
            firstName = firstName,
            lastName = lastName,
            dob = birthDateObj.date(),
            bloodGroup = bloodGroup,
            phoneNumber = phoneNumber,
            
            email = email,
            address = address,
            date = current_date,
            hospitalName = hospitalName,
            isThalassemia = isThalassemia,
            hasCancer  = hasCancer,
            firstDonCheck = firstDonCheck,
            firstDonation = firstDonation,
            gender=gender
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
def get_recipient_records(request):
    if request.method == "GET":
        email = request.session.get('member_id')
        print(email)
        if email is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        recipients = Recipient.objects.filter(email = email,status__in = ['Confirmed','Pending','Rejected']).order_by("-date").all()
        print(recipients)
        data = []
        calender = Calender.objects.first()
        
        isEligible= True
        difference = 15
        eligibleRecipient = Recipient.objects.filter(email = email,status__in = ['Confirmed' ,'Pending']).order_by("-date").first()
        if eligibleRecipient is not None:
            current_date_string= datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
            current_date = datetime.datetime.strptime(current_date_string, "%Y-%m-%d").date()
            difference =  (current_date.year - eligibleRecipient.requestDate.year)*365 +( current_date.month-eligibleRecipient.requestDate.month)*30 + (current_date.day - eligibleRecipient.requestDate.day) 
            isEligible = difference >= 15
        
        newData = { 
            "quantity" : calender.quantity,
            "isEligible" : isEligible,
            "remainingDays" : 15-difference,
        }
        if recipients:
            try :
                for recipient in recipients:
                    
                    data.append(
                        {
                            
                            "bloodGroup" : recipient.bloodGroup,
                            "date" : recipient.requestDate, 
                            "status" : recipient.status,
                            "recipient_name" : recipient.firstName +" " + recipient.lastName,
                            'gender' : recipient.gender,
                        }
                    )

                  
                
                
            except Exception as e:
                print(e)
                return JsonResponse({"error" : "No Donor has not Confirmed yet"},status=500)
        return JsonResponse({"status" : "Data fetched","pastRecord" :data,"recipientData" : newData},status=200)
    
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)


