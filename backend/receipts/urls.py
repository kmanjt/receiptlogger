from django.urls import path

from . import views

urlpatterns = [
    path('create_receipt/', views.create_receipt, name='create_receipt'),
    path('update_receipt_status/<int:receipt_id>/',
         views.update_receipt_status, name='update_receipt_status'),
    path('add_approved_receipts_to_google_sheet/', views.add_approved_receipts_to_google_sheet,
         name='add_approved_receipts_to_google_sheet'),
]
