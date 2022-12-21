from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_admin = models.BooleanField(default=False)


class Receipt(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('approved', 'Approved'),
    ]
    person_name = models.CharField(max_length=200)
    person_email = models.EmailField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    image = models.ImageField(upload_to='receipt_images')
    status = models.CharField(
        max_length=8, choices=STATUS_CHOICES, default='pending')
