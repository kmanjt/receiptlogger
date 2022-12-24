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
    person_name = models.CharField(max_length=200) 
    person_email = models.EmailField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    image = models.ImageField(upload_to='receipt_images')
    status = models.CharField(
        max_length=8, choices=STATUS_CHOICES, default='pending')
