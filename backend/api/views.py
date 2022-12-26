from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import HttpResponse
from rest_framework.response import Response
import json
import re
from rest_framework.decorators import api_view
import os
from dotenv import load_dotenv
from django.core.mail import EmailMessage
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser

# Create your views here.
from django.http import JsonResponse


load_dotenv()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['iban'] = user.last_name
        token['admin'] = user.is_staff
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def getRoutes(request):
    routes = [ "api/token/",
    "api/token/refresh/",
    "api/register/", ]


    return Response(routes, status=200)

# check if the email is a DCU email
def is_dcu_email(email):
    pattern = r'@(mail\.)?dcu\.ie$'
    return re.search(pattern, email) is not None

# send an email to the user with their login credentials
def send_confirmation_email(data):
    subject = 'Enactus DCU - Treasury Confirmation'
    message = f'Hello {data["username"]},\n\nThank you for registering with the Enactus DCU Treasury!\n\nYour account has been created, you can now log in with the following credentials:\n\nUsername: {data["username"]}\nPassword: {data["password"]}\n\nRegards,\nEnactus DCU'
    from_email = os.getenv('EMAIL_HOST_USER')
    recipient_list = [f'{data["email"]}']

    email = EmailMessage(subject, message, from_email, recipient_list)

    try:
        email.send()
        return True # email sent successfully
    except Exception as e:
        print(e)
        return False # email failed to send
    

# register a new user account from a POST request
@api_view(['POST'])
def register(request):
    # Parse the JSON object from the POST request
    try:
        data = request.body

        data = json.loads(data)
    except json.decoder.JSONDecodeError:
        return Response({'error': 'Invalid request body'}, status=400)

    # Check if the email is a DCU email
    if not is_dcu_email(data['email']):
        return Response({'error': 'Invalid email, must be a DCU email!'}, status=400)
    
    # check if the password is valid
    if len(data['password']) < 5:
        return Response({'error': 'Password must be at least 5 characters'}, status=400)
    
    # check if the IBAN is valid
    if len(data['iban']) != 22:
        return Response({'error': 'Invalid IBAN'}, status=400)
    
    # send an email to the user with their login credentials
    if not send_confirmation_email(data):
        return Response({'error': 'Failed to send confirmation email'}, status=400)

    # Create a new user account
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            last_name=data['iban']
        )
    except KeyError:
        return Response({'error': 'Invalid request body'}, status=400)
    except IntegrityError:
        return Response({'error': 'Username or email already exists'}, status=400)

    # return an access and refresh token
    token = MyTokenObtainPairSerializer.get_token(user)


    # return the access and refresh token clearly seperated
    return Response({ 'access': str(token.access_token), 'refresh': str(token) }, status=200)

# Get all users email addresses if the user is an admin
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    emails = []

    for user in users:
        emails.append(user.email)

    return Response(emails, status=200)