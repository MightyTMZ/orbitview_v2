from rest_framework import serializers
from .models import (
    ConnectionList, 
    ConnectionRequest,
)


class ConnectionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionList
        fields = [
            'user',
            'connections',
        ]


class ConnectionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionRequest
        fields = [
            'sender',
            'receiver',
            'is_active',
            'timestamp',
        ]