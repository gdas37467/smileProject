from django.shortcuts import render
import json
import datetime
from recipient.models import Recipient
from donor.models import Donor,MatchedDonor,Calender
from django.http import JsonResponse
import datetime
import pytz
import uuid
from twilio.rest import Client
from sms import send_sms
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt



#matchpair view

def matchpair(donor,new_recipient,date):
    
        
    matched_donor = MatchedDonor(recipient=new_recipient.id, donor=donor.id,date=date)
    matched_donor.save()
    dateObj = Calender.objects.filter(date = date).first()
    if dateObj:
        if dateObj.quantity <=0:
            return JsonResponse({"error" : "Dates Not available "},status = 400)
        dateObj.quantity -= 1
        dateObj.save()

    try:

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        # Replace 'to' with the recipient's phone number
        to = donor.phoneNumber
        
        # Replace 'from_' with your Twilio phone number
        from_ = settings.TWILIO_PHONE_NUMBER
        
        message = client.messages.create(
            body="Hi "+ donor.firstName + " , Someone Urgently needs blood of group "+ donor.bloodGroup +"\n Kindly contact to our NGO ASAP", 
            to=to,
            from_=from_
        )
    except:
        pass

# Create your views here.
@csrf_exempt
def request_blood(request):
    if request.method == "POST" : 
        body = json.loads(request.body)
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        bloodGroup = body['bloodGroup']
        alternateNumber = body['phoneNumber']
        email = body['email']
        address = body['address']
        units =body['units']
        dateString = body['date']
        date_format = '%Y-%m-%d'
        phoneNumber = request.session.get('member_id')
        if phoneNumber is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        #print(dob)
        birthDateObj = datetime.datetime.strptime(dob, date_format)
        #dateObj = datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata'))
        iso_format = "%Y-%m-%d"
        #date  = datetime.datetime.strftime(dateObj, iso_format)
        date = datetime.datetime.strptime(dateString, "%Y-%m-%d").date()
        id = str(uuid.uuid4())
        
        current_date_string= datetime.datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.datetime.strptime(current_date_string, "%Y-%m-%d").date()


        try:
            recipient = Recipient.objects.filter(phoneNumber = phoneNumber,status__in = ['Confirmed' ,'Pending']).order_by("-date").first()
            if recipient is not None:
                #lastRecieved = datetime.datetime.strptime(recipient.date,"%Y-%m-%d").date()
                
                if ( current_date.month-recipient.date.month)*30 + (current_date.day - recipient.date.day) <15:
                    return JsonResponse({"error" : "Cannot place request withing 15 days of last recieved"},status = 400)
            
            
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "Something went wrong"},status = 400)
        
        donors = Donor.objects.filter(bloodGroup = bloodGroup).all()
        print(donors)
            
        if not donors:
            return JsonResponse({"error" : "Currently no donor available of this BloodGroup, please try later or Contact our NGO!"},status=400)

        try:
           
            new_recipient = Recipient(
            id= id,
            firstName = firstName,
            lastName = lastName,
            dob = birthDateObj.date(),
            bloodGroup = bloodGroup,
            phoneNumber = phoneNumber,
            alternateNumber = alternateNumber,
            email = email,
            address = address,
            date = date,
            units = units,
           
            )
            new_recipient.save()

          
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'error while saving form'},status=500)
        



        
        
        try:
            for donor in donors:
                print(donor)
                lastDonated = donor.lastDonated
                print(lastDonated)
                if lastDonated:
                    print(months_passed)
                    months_passed = (current_date.year - lastDonated.year) * 12 + (current_date.month - lastDonated.month)
                    if months_passed > 3:
                        matchpair(donor,new_recipient,date)
                        
                else:
                    matchpair(donor,new_recipient,date)
                    print(donor.firstName)
                        
            
            return JsonResponse({"success" : "Request Placed Successfully"},status =201)     
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "No Donor Found of this Blood Group"},status=404)
        
    return JsonResponse({"error" : "Invalid request method"},status =400)





@csrf_exempt
def get_available_dates(request):
    if request.method == "GET":
        # phoneNumber = request.session.get('member_id')
        # if phoneNumber is None:
        #     return JsonResponse({"error" : "Invalid Session Id"},status =401)
        try:
            dates = Calender.objects.all()
            data = {}
            for date in dates:
                data[str(date.date.day)] =str(date.quantity)
        except Exception as e:
            return JsonResponse({"error" : "Something Went Wrong"},status=500)
        return JsonResponse({"status" : "success","dates" : data},status=200)
    return JsonResponse({"error" : "Invalid request method"},status =400)


@csrf_exempt
def get_recipient_records(request):
    if request.method == "GET":
        phoneNumber = request.session.get('member_id')
        print(phoneNumber)
        if phoneNumber is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        
        recipient = Recipient.objects.filter(phoneNumber = phoneNumber).first()
        print(recipient)

        if recipient is None:
            return JsonResponse({"status" : "error" , "msg" : "No records Found"},status = 500)

        try :
            data = []
            donationList = MatchedDonor.objects.filter(status = "Confirmed",donated = "Yes", recipient = recipient.id).order_by("-date").all()
            print(donationList)
            pendingDonation = MatchedDonor.objects.filter(status = "Confirmed",donated = "No", recipient = recipient.id).first()
            print(pendingDonation)
            if pendingDonation is not None:
                pendingDonor = Donor.objects.filter(id = pendingDonation.donor).first()
                print(pendingDonor)
                pendingDonorJson = {
                    "name" : pendingDonor.firstName +" " +  pendingDonor.lastName,
                    "address" : pendingDonor.address,
                    "phoneNumber" : pendingDonor.phoneNumber,
                }
            
            if donationList:
                for obj in donationList:
                    donor = Donor.objects.filter(id = obj.donor).first()
                    data.append({
                        "recipient_name" : donor.firstName +" "+ donor.lastName,
                        "bloodGroup" : donor.bloodGroup,
                        "address" : donor.address,
                        "date" : obj.date
                        
        
                    })
            
            return JsonResponse({"status" : "Data fetched","pastRecord" :data,"pendingDonation" : pendingDonorJson },status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "No Donor has not Confirmed yet"},status=500)
    
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)