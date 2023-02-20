from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, User

class Receipt(models.Model):
    id = models.AutoField(primary_key=True)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('approved', 'Approved'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True) # This is the user who uploaded the receipt
    total_amount = models.DecimalField(max_digits=10, decimal_places=2) # The total amount of the receipt
    email = models.EmailField(max_length=255, null=True) # The email of the user who uploaded the receipt
    username = models.CharField(max_length=255, null=True) # The username of the user who uploaded the receipt
    reason = models.CharField(max_length=255, null=True) # The reason for the expense
    date = models.DateField()
    image = models.ImageField(upload_to='receipt_images')
    status = models.CharField(
        max_length=8, choices=STATUS_CHOICES, default='pending')
    admin_comment = models.TextField(null=True)
    status_updated_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name='status_updated_by', editable=False)
    status_updated_at = models.DateTimeField(auto_now=True, editable=False)
    iban = models.CharField(max_length=255, null=True)
    reimbursed = models.BooleanField(default=False)
    income = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.date}: {self.username} - {self.reason} - {self.total_amount}'