from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, Chat
from .serializers import RoomSerializer, ChatSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class RoomListCreate(APIView):
    def get(self, request):
        rooms = Room.objects.filter(author=request.user) | Room.objects.filter(friend=request.user)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RoomDetail(APIView):
    def get(self, request, pk):
        room = get_object_or_404(Room, pk=pk)
        serializer = RoomSerializer
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ChatListCreate(APIView):
    def get(self, request, room_id):
        room = get_object_or_404(Room, pk=room_id)
        chats = Chat.objects.filter(room_id=room).order_by('date')
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, room_id):
        room = get_object_or_404(Room, pk=room_id)
        data = request.data
        data['room_id'] = room.id
        data['author'] = request.user.id
        serializer = ChatSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarkAsSeenAPIView(APIView):
    """
    Marks messages as seen in a specific room.
    """

    def post(self, request, room_id):
        room = get_object_or_404(Room, pk=room_id)
        chats = Chat.objects.filter(room_id=room, friend=request.user, has_seen=False)
        chats.update(has_seen=True)
        return Response({"message": "Messages marked as seen."}, status=status.HTTP_200_OK)