import json

from django.shortcuts import render, get_object_or_404
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Receipt
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from django.contrib.auth.decorators import login_required
import base64
from dotenv import load_dotenv
from django.core.files.base import ContentFile
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from io import BytesIO
from django.core.files import File
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import ReceiptSerializer
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser, User


load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the service account credentials from a JSON file
credentials = Credentials.from_service_account_file(
    os.path.join(BASE_DIR, 'client.json'),
    scopes=['https://www.googleapis.com/auth/spreadsheets', "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"],
)

# Create a Google Sheets API client with the service account credentials
service = build('sheets', 'v4', credentials=credentials)


# Create a new receipt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_receipt(request):
    if isinstance(request.user, AnonymousUser):
        return Response({'error': 'Authentication credentials were not provided.'}, status=401)

    # Parse the JSON object from the POST request
    try:
        data = request.body

        data = json.loads(data)
    except json.decoder.JSONDecodeError:
        return HttpResponse('Invalid request body')

    image_data = data['image']
    # Decode the image data into a binary image file
    image_data = image_data.split(';base64,')[1]

    # Decode the base64-encoded image data
    image_binary = base64.b64decode(image_data)



    try:
        
        # Check if the receipt already exists
        Receipt.objects.get(
            user = request.user,
            username=data["username"],
            email=data["email"],
            reason=data["reason"],
            total_amount=data["total_amount"],
            date=data["date"],
            image=ContentFile(image_binary, name=data['image_name']),
            iban=data["iban"],
            status="pending",
        )

        # If the receipt already exists, return a response indicating a duplicate receipt
        return Response('Duplicate receipt', status=409)

    except Receipt.DoesNotExist:
        # If the receipt does not exist, create a new receipt and return a response indicating that it was created
        receipt = Receipt(
            user = request.user,
            username=data["username"],
            email=data["email"],
            reason=data["reason"],
            total_amount=data["total_amount"],
            date=data["date"],
            image=ContentFile(image_binary, name=data['image_name']),
            iban=data["iban"],
            status="pending",
        )
        receipt.save()

    return Response('Receipt created', status=201)


# Update the receipt status and add the approved receipts to the Google Sheet
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_receipt_status(request, receipt_id):
    # Get the receipt object
    receipt = get_object_or_404(Receipt, pk=receipt_id)

    # Parse the JSON object from the PATCH request
    try:
        data = request.body
        data = json.loads(data)
    except json.decoder.JSONDecodeError:
        return Response('Invalid request body', status=400)

    # Update the receipt status
    old_status = receipt.status
    receipt.status = data['status']
    receipt.status_updated_by = User.objects.get(id=request.user.id)
    receipt.save()

    if receipt.status == 'approved' and old_status != 'approved':
        add_approved_receipts_to_google_sheet(receipt)

    return Response('Receipt status updated', status=200)


# Add the approved receipts to the Google Sheet
def add_approved_receipts_to_google_sheet(receipt):

    # Create a list of rows to append to the Google Sheet
    rows = []
    rows.append([str(receipt.email), str(receipt.total_amount), str(receipt.date), str(receipt.reason), str(receipt.image.url)])

    # Append the rows to the Google Sheet
    sheet_id = os.getenv('GOOGLE_SHEET_ID')  # Replace with the ID of the Google Sheet
    range_ = 'Approved Receipts!A4:E4'  # Replace with the range of cells to which you want to append the rows
    value_input_option = 'RAW'  # Replace with the value input option you want to use
    # Replace with the insert data option you want to use
    insert_data_option = 'INSERT_ROWS'

    try:
        result = service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=range_,
            valueInputOption=value_input_option,
            insertDataOption=insert_data_option,
            body={'values': rows}
        ).execute()
        print(
            f'{result["updates"]["updatedRows"]} rows appended to the Google Sheet.')
    except HttpError as error:
        print(f'An error occurred: {error}')

    return HttpResponse('Approved receipts added to Google Sheet')


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_all_receipts(request):
    user = request.user

    # return all receipts associated with the user
    receipts = Receipt.objects.filter(user=user)

    serializer = ReceiptSerializer(receipts, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser]) 
def get_all_receipts_admin(request):
    receipts = Receipt.objects.all()

    serializer = ReceiptSerializer(receipts, many=True)
    
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_receipt(request, receipt_id):
    # delete the receipt if its the same users receipt

    user = request.user

    receipt = get_object_or_404(Receipt, pk=receipt_id)

    if receipt.user != user:
        return Response({'error': 'You do not have permission to delete this receipt.'}, status=401)
    
    receipt.delete()
    return Response({'message': 'Receipt deleted'}, status=200)

# Get the total due for each user
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_total_due(request):
    # Get all the receipts from the database
    receipts = Receipt.objects.all()

    # Create a dictionary to store the total due for each user
    total_due = {}

    # Iterate through the receipts and add the total amount to the total due for each user
    for receipt in receipts:
        # check if the receipt was approved
        if receipt.status != 'approved':
            continue
        else:
            if receipt.user.email in total_due:
                total_due[receipt.user.email] += receipt.total_amount
            else:
                total_due[receipt.user.email] = receipt.total_amount

    return Response(total_due, status=200)

# Set a receipt to reimbursed if admin
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def set_reimbursed(request, receipt_id):
    # Get the receipt object
    receipt = get_object_or_404(Receipt, pk=receipt_id)

    # Parse the JSON object from the PATCH request
    try:
        data = request.body
        data = json.loads(data)
    except json.decoder.JSONDecodeError:
        return Response('Invalid request body', status=400)

    # Toggle between reimbursed and not reimbursed
    if receipt.reimbursed:
        receipt.reimbursed = False
    else:
        receipt.reimbursed = True
    receipt.save()

    return Response(f'Receipt reimbursed: {receipt.reimbursed}', status=200)