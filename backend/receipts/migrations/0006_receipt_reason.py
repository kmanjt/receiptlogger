# Generated by Django 4.1.4 on 2022-12-25 02:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('receipts', '0005_remove_receipt_person_email_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='receipt',
            name='reason',
            field=models.CharField(max_length=255, null=True),
        ),
    ]