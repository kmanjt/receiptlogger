from django.contrib import admin

# Register your models here.
from .models import Receipt


class ReceiptAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'email', 'username', 'reason', 'date', 'image', 'status', 'status_updated_by', 'status_updated_at', 'iban', 'reimbursed']

admin.site.register(Receipt, ReceiptAdmin)
