from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission



class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    is_admin = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        Group,
        related_name='user_groups',
        verbose_name=('groups'),
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions granted to each of '
            'their groups.'
        ),
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='user_permissions',
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_query_name='user',
    )


class Receipt(models.Model):
    id = models.AutoField(primary_key=True)
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
