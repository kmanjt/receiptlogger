from django.urls import path

from . import views

urlpatterns = [
    path('create_receipt/', views.create_receipt, name='create_receipt'),
    path('update_receipt_status/<int:receipt_id>/',
         views.update_receipt_status, name='update_receipt_status'),
    path('add_approved_receipts_to_google_sheet/', views.add_approved_receipts_to_google_sheet,
         name='add_approved_receipts_to_google_sheet'),
    path('all/', views.get_all_receipts, name='get_all_receipts'),
    path('admin/', views.get_all_receipts_admin, name='get_all_receipts_admin'),
    path('delete/<int:receipt_id>/', views.delete_receipt, name='delete_receipt'),
]
