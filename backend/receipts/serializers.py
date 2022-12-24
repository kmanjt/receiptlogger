from rest_framework import serializers
from .models import Receipt

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ('id', 'user', 'person_name', 'person_email', 'total_amount', 'date', 'image', 'status')
