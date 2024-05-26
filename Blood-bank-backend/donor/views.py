from django.shortcuts import render
from django.http import HttpResponse
from donor.models import Donor
from recipient.models import Recipient
from django.http import JsonResponse
import json
from datetime import datetime
from django.contrib.auth.models import User

from django.views.decorators.csrf import csrf_exempt,csrf_protect
import pyotp
from sms import send_sms
from twilio.rest import Client
from django.core.serializers import serialize
from django.conf import settings
import uuid
import jwt

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
#from django.core.mail import send_mail
import time
import pytz
from smtplib import SMTPException
from django.middleware.csrf import get_token
import smtplib,ssl
from django.core.mail import send_mail



import random



# Create your views here.
key = settings.SECRET_KEY
#print(key)

def generate_otp():
    return str(random.randint(100000, 999999))

@csrf_protect
def register(request) :
    email = request.session.get('email')

    if request.method == "POST":
        body = json.loads(request.body)
        firstName = body['firstName']
        lastName = body['lastName']
        dob = body['dob']
        bloodGroup = body['bloodGroup']
        phoneNumber = body['phoneNumber']
        #email = body['email']
        otp = body['otp']
        address = body['address']
        gender = body['gender']
        lastDonated = body['lastDonated']
        isThalassemia = body['isThalassemia']
    
        isDonor = Donor.objects.filter(email = email).first()
        if isDonor is not None:
            return JsonResponse({"error":"Email Already Exists for another Donor"},status=409)

        

        date_format = '%Y-%m-%d'
        id=str(uuid.uuid4())
        print(id)
        print(dob)
        date_obj = datetime.strptime(dob, date_format)
        current_date_string= datetime.now(tz=pytz.timezone('Asia/Kolkata')).date().isoformat()
        current_date = datetime.strptime(current_date_string, "%Y-%m-%d").date()
        isDonor2 = Donor.objects.filter(firstName = firstName , lastName = lastName , bloodGroup = bloodGroup ,dob =date_obj.date()).first()
        if isDonor2 is not None : 
            return JsonResponse({"error" : "Kindly contact admin as you are already registered as a donor"},status=400)
        
        try:
            
            secret_key = request.session.get('secret_key')
            print(secret_key)
            totp = pyotp.TOTP(secret_key,interval=300)
            status = totp.verify(otp)
            print(status)
            # email = request.session.get('email')
            del request.session['email']
            del request.session['secret_key']
            
            request.session['member_id'] = email

            isDonor = True
            isRecipient = False
            recipient = Recipient.objects.filter(email= email).first()
            if recipient is not None:
                isRecipient = True

            type = jwt.encode({'isDonor': isDonor,"isRecipient" : isRecipient}, key, algorithm='HS256')
            
            if status == False:
                return JsonResponse({"error" : "Incorrect OTP"  },status=400)
            

        except Exception as e:
            print(e)
            return JsonResponse({"status" : "OTP verification Failed "  },status=400)



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
                registrationDate = current_date


            )
            new_donor.save()
            
            request.session.set_expiry(45*60)
            
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'While regestering'},status=500)
        
        
        return JsonResponse({"success" : "Donor Registered Successfully","user_type" : type},status = 200)
    return JsonResponse({"error" : "Invalid request method"},status =400)
 


@csrf_exempt
def user_logout(request):
    if request.method=="GET":
        try:
            del request.session["member_id"]
        except KeyError:
           JsonResponse({'error' : "Invalid session key"})
        return JsonResponse({"status" : "You're logged out."})
    return JsonResponse({"error" : "Invalid request method"},status =400)


#only for recipient and donor registration
@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        
        body  = json.loads(request.body)
        email = body['email'] 
        get_token(request)
        #print(get_usage(request=request, fn=ratelimit))
        #was_limited = getattr(request, 'limited', False)
        if not email:
            return JsonResponse({'status': 'Email is required.'}, status=400)

        # secret_key = pyotp.random_base32()
        # #print(secret_key)
        # totp = pyotp.TOTP(secret_key, interval=300)  
        # otp = totp.now()
    
        otp = generate_otp()
        # Store the OTP and its creation time in the session
        request.session['otp'] = {
                    'otp': otp,
                    'timestamp': time.time()  # Add the timestamp when OTP is generated
                }
        #request.session['otp_creation_time'] = time.time()
        request.session['email'] = email
        
        print(email)
        print(otp)


        try: 
            message = f'Your OTP is: {otp}'
            subject = 'OTP Verification'
            send_mail(
                subject,
                message,
                'support@smileorganization.in',
                [email],
                fail_silently=False,
            )

        except SMTPException as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=500)
        
        return JsonResponse({"success" : "OTP sent successfully"},status  =200) 
    return JsonResponse({"error" :"Invalid request Method"}, status=409)
    


@csrf_protect
def verify_otp(request):
    if request.method=="POST":
        try:
            body = json.loads(request.body)
            otp_submitted = body['otp']
            # secret_key = request.session.get('secret_key')
            # print(secret_key)
            # totp = pyotp.TOTP(secret_key,interval=300)
            # status = totp.verify(otp)
            # print(f'sttus - >  {status}')
            email = request.session.get('email')
            otp_data = request.session.get('otp')
            
            

            # request.session['member_id'] = email

            
            
            isDonor = False
            isRecipient = True
            donor = Donor.objects.filter(email=email).first()
            print(donor)
            if donor is not None:
                isDonor = True
            print("isdonor " + str(isDonor))
            print("isrecipient" + str(isRecipient))
            type = jwt.encode({'isDonor': isDonor,"isRecipient" : isRecipient}, key, algorithm='HS256')

            
            

            

            if otp_data:
                otp_generated = otp_data.get('otp')
                timestamp = otp_data.get('timestamp')
                current_time = time.time()
                print(f"current time - > {current_time}")
                print(f"opt -> {otp_submitted}")
                # Check if OTP is within the 5-minute validity period
                if otp_generated == otp_submitted and current_time - timestamp <= 300:
                    # OTP matched and is still valid, do further processing here
                # OTP matched, do further processing here
                    print(f'status : success')
                    request.session["member_id"] = email
            
                    del request.session['email']
                    request.session.set_expiry(45*60)
                    return JsonResponse({'success': 'OTP verified successfully', "user_type" : type},status=200)
                else:
                    return JsonResponse({'success': 'error', 'message': 'Invalid OTP or OTP has expired.'},status=400)
        except Exception as e:
            print(e)
            return JsonResponse({"error" : "OTP verification Failed"  },status=400)
            
        
    
    return JsonResponse({"error" : "Invalid Request method"},status =400)




@csrf_exempt
def donor_send_otp(request):
    if request.method== "POST": 
        body  = json.loads(request.body)
        email  = body['email'] 
        get_token(request)
        if not email:
            return JsonResponse({'status': 'Email is required.'}, status=400)
        donor = Donor.objects.filter(email= email).first()
        if donor is None:
            return JsonResponse({"error" : "Donor Not Registered"},status = 401)
        # secret_key = pyotp.random_base32()
        # print(secret_key)
        # totp = pyotp.TOTP(secret_key, interval=300)  
        # otp = totp.now()
        otp = generate_otp()
        # Store the OTP and its creation time in the session
        request.session['otp'] = {
                    'otp': otp,
                    'timestamp': time.time()  # Add the timestamp when OTP is generated
                }
     

        # Store the OTP and its creation time in the session
        #request.session['secret_key'] = secret_key
        #request.session['otp_creation_time'] = time.time()
        request.session['email'] = email
        
        #generate JWT token for user verification
        try: 
            # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
            # # Replace 'to' with the recipient's phone number
            # to = phoneNumber
            
            # # Replace 'from_' with your Twilio phone number
            # from_ = settings.TWILIO_PHONE_NUMBER
            
            # message = client.messages.create(
            #     body="Hi , your otp is " + otp,
            #     to=to,
            #     from_=from_
            # )

            message = f'Your OTP is: {otp}'
            subject = 'OTP Verification'
            send_mail(
                subject,
                message,
                'support@smileorganization.in',
                [email],
                fail_silently=False,
                )
            
        except Exception as e:
            print(e) 
            return JsonResponse({"error" : "error occured while sending sms"}, status=500)
        
        return JsonResponse({"success" : "OTP sent successfully"},status  =200)
    return JsonResponse({"error" : "Invalid request method"},status = 400)


#get donor past records

@csrf_protect
def get_donor_records(request):
    if request.method == "GET":
        email = request.session.get('member_id')
        if email is None:
            return JsonResponse({"error" : "Invalid Session Id"},status =401)
        donor = Donor.objects.filter(email=email).first()
        if donor is None : 
            JsonResponse({"error" : "Something Went Wrong"},status=401)

        try :
            donorList = Donor.objects.order_by("-totalDonation").all()
            donor_list_data = []
            if donorList:
                donor_list_data = [{'id': donor.id, 
                                    'firstName': donor.firstName,
                                    'lastName': donor.lastName,
                                    
                                    'totalDonation' : donor.totalDonation,
                                    } for donor in donorList]
                print(donor_list_data)
            donorDetailsObj = Donor.objects.filter(email=email).first()
            
            is_eligible = True
            differenceInDays = 90
            if donorDetailsObj.lastDonated is not None:

                last_donation_date = donorDetailsObj.lastDonated
                current_date = datetime.now().date()
                difference = current_date - last_donation_date
                #difference_in_months = (current_date.year - last_donation_date.year) * 12 + current_date.month - last_donation_date.month
                is_eligible = difference.days >= 90 
                differenceInDays = difference.days
            # print(difference.days)
            donorDetails = {
                
                "id" : donorDetailsObj.id,
                "firstName" : donorDetailsObj.firstName,
                "lastName" : donorDetailsObj.lastName,
                 "lastDonated" : donorDetailsObj.lastDonated,
                 "phoneNumber" : donorDetailsObj.phoneNumber,
                 "emailId" : donorDetailsObj.email,
                 'gender' : donor.gender,
                 'isThalassemia'  : donor.isThalassemia,
                 "address" : donorDetailsObj.address,
                 "bloodGroup" : donorDetailsObj.bloodGroup,
                 'totalDonation' : donorDetailsObj.totalDonation,
                 'isEligible' : is_eligible,
                 'remainingDays' : (90 - differenceInDays) 

            }

            
        except Exception as e:
            print(e)
            JsonResponse({"error" : "Error while fetching data"},status=500)
        return JsonResponse({"status" : "Data fetched","donorDetails" : donorDetails,"donorList" : donor_list_data },status=200)
    return JsonResponse({"error" : "Invalid Request Method"},status = 400)
        




