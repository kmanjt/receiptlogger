from django.urls import path

from . import views

# The URL patterns for the receipts app which are prefixed with /receipts/
urlpatterns = [
    path('create_receipt/', views.create_receipt, name='create_receipt'), # Create a receipt
    path('update_receipt_status/<int:receipt_id>/',
         views.update_receipt_status, name='update_receipt_status'), # Update the status of a receipt
    path('add_approved_receipts_to_google_sheet/', views.add_approved_receipts_to_google_sheet, 
         name='add_approved_receipts_to_google_sheet'), # Add the approved receipts to the Google Sheet
    path('all/', views.get_all_receipts, name='get_all_receipts'), # Get all receipts for a user
    path('admin/', views.get_all_receipts_admin, name='get_all_receipts_admin'), # Get all receipts as an admin
    path('delete/<int:receipt_id>/', views.delete_receipt, name='delete_receipt'), # Delete a receipt
     path('admin/get-total-due/', views.get_total_due, name='get_total_due'), # Get the total due for each user
     path('admin/set-reimbursed/<int:receipt_id>/', views.mark_reimbursed, name='mark_reimbursed'), # Set a receipt to reimbursed if admin')
     path('admin/reimburse-approved/', views.mark_approved_receipts, name='mark_approved_receipts'), # Set all approved receipts for a user to reimbursed if admin
     path('admin/update-receipt-note/<int:receipt_id>/', views.update_receipt_admin_note, name='update_receipt_note'), # Update the note for a receipt if admin
     path('admin/sort_by_date/', views.get_receipts_by_date, name='get_receipts_by_date'), # Get all receipts for by date
]
