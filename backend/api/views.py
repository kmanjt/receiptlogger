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

# Create your views here.
from django.http import JsonResponse

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
        return Response({'error': 'Invalid email'}, status=400)
    
    # check if the password is valid
    if len(data['password']) < 5:
        return Response({'error': 'Password must be at least 5 characters'}, status=400)
    
    # check if the IBAN is valid
    if len(data['iban']) != 22:
        return Response({'error': 'Invalid IBAN'}, status=400)
    
    # check if the IBAN is Irish or Lithuanian
    if data['iban'][:2] != 'IE' or data['iban'][:2] != 'LT':
        return Response({'error': 'Invalid IBAN'}, status=400)


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