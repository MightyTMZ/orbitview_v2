from rest_framework import serializers
from .models import (
    Room, 
    Chat
)

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            'room_id',
            'author',
            'friend',
            'created',
        ]

    
class ChatSerializer(serializers.ModelSerializer):
    
    room_id = RoomSerializer()
    
    class Meta:
        model = Chat
        fields = [
            'room_id',
            'author', 
            'friend',
            'text', 
            'date', 
            'has_seen'
        ]

