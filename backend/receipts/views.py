import json

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from .models import Receipt
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from django.contrib.auth.decorators import login_required

from dotenv import load_dotenv
import google.auth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the service account credentials from a JSON file
credentials = Credentials.from_service_account_file(
    os.path.join(BASE_DIR, 'client.json'),
    scopes=['https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'],
)

# Create a Google Sheets API client with the service account credentials
service = build('sheets', 'v4', credentials=credentials)


# Create a new receipt
def create_receipt(request):
    # Parse the JSON object from the POST request
    data = json.loads(request.body)

    # Create a new Receipt instance
    receipt = Receipt(
        person_name=data["person_name"],
        person_email=data["person_email"],
        total_amount=data["total_amount"],
        date=data["date"],
        image=ContentFile(base64.b64decode(
            data["image"]), name=data["image_name"]),
        status="pending",
    )

    # Save the Receipt instance to the database
    receipt.save()

    return HttpResponse('Receipt created')


# Update the receipt status and add the approved receipts to the Google Sheet
@login_required
def update_receipt_status(request, receipt_id):
    # Get the user object
    user = request.user

    # Check if the user is an admin
    if not user.is_admin:
        return HttpResponse('You are not authorized to perform this action')

    # Get the receipt object
    receipt = get_object_or_404(Receipt, pk=receipt_id)

    # Update the status field of the receipt
    old_status = receipt.status
    receipt.status = request.POST['status']
    receipt.save()

    if receipt.status == 'approved' and old_status != 'approved':
        add_approved_receipts_to_google_sheet(None)

    return HttpResponse('Receipt status updated')


# Add the approved receipts to the Google Sheet
def add_approved_receipts_to_google_sheet(request):
    # Get the approved receipts from the database
    approved_receipts = Receipt.objects.filter(status='approved')

    # Create a list of rows to be added to the Google Sheet
    rows = []
    for receipt in approved_receipts:
        rows.append([receipt.store_name, receipt.total_amount, receipt.date])

    # Append the rows to the Google Sheet
    sheet_id = 'YOUR_SHEET_ID'  # Replace with the ID of the Google Sheet
    range_ = 'A1'  # Replace with the range of cells to which you want to append the rows
    value_input_option = 'RAW'  # Replace with the value input option you want to use
    # Replace with the insert data option you want to use
    insert_data_option = 'INSERT_ROWS'

    try:
        result = service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=range_,
            valueInputOption=value_input_option,
            insertDataOption=insert_data_option,
            values=rows
        ).execute()
        print(
            f'{result["updates"]["updatedRows"]} rows appended to the Google Sheet.')
    except HttpError as error:
        print(f'An error occurred: {error}')

    return HttpResponse('Approved receipts added to Google Sheet')