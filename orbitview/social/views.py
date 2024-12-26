from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import ConnectionList, ConnectionRequest
from .serializers import ConnectionListSerializer, ConnectionRequestSerializer


class ConnectionList(APIView):
    def get(self, request):
        connection_list = get_object_or_404(ConnectionList, user=request.user)
        serializer = ConnectionListSerializer(connection_list)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserConnectionList(APIView):
    def get(self, request, username):
        requested_user = User.objects.filter(username=username)

        if requested_user.profile.hide_connection_list:
            # People can still see their mutual connections and followers
            return Response({"message": f"{requested_user.first_name} has their full connection list set to private"})

        connection_list = get_object_or_404(ConnectionList, user=requested_user)
        serializer = ConnectionListSerializer(connection_list)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ConnectionRequest(APIView):
    def get(self, request):
        # Get all connection requests for the authenticated user
        received_requests = ConnectionRequest.objects.filter(receiver=request.user, is_active=True)
        sent_requests = ConnectionRequest.objects.filter(sender=request.user, is_active=True)
        received_serializer = ConnectionRequestSerializer(received_requests, many=True)
        sent_serializer = ConnectionRequestSerializer(sent_requests, many=True)
        return Response({
            "received_requests": received_serializer.data,
            "sent_requests": sent_serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, request_id, action):
        connection_request = get_object_or_404(ConnectionRequest, pk=request_id, is_active=True)

        if action == "accept":
            if connection_request.receiver != request.user:
                return Response({"error": "You can only accept requests sent to you."}, status=status.HTTP_403_FORBIDDEN)
            connection_request.accept()
            return Response({"message": "Connection request accepted."}, status=status.HTTP_200_OK)

        elif action == "decline":
            if connection_request.receiver != request.user:
                return Response({"error": "You can only decline requests sent to you."}, status=status.HTTP_403_FORBIDDEN)
            connection_request.decline()
            return Response({"message": "Connection request declined."}, status=status.HTTP_200_OK)

        elif action == "cancel":
            if connection_request.sender != request.user:
                return Response({"error": "You can only cancel requests sent by you."}, status=status.HTTP_403_FORBIDDEN)
            connection_request.cancel()
            return Response({"message": "Connection request canceled."}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class SendConnectionRequest(APIView):
    """
    Send a connection request to another user.
    """

    def post(self, request, receiver_id):
        receiver = get_object_or_404(User, pk=receiver_id)
        if ConnectionRequest.objects.filter(sender=request.user, receiver=receiver, is_active=True).exists():
            return Response({"error": "Connection request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        if ConnectionList.objects.filter(user=request.user, connections=receiver).exists():
            return Response({"error": "You are already connected to this user."}, status=status.HTTP_400_BAD_REQUEST)
        ConnectionRequest.objects.create(sender=request.user, receiver=receiver)
        return Response({"message": "Connection request sent."}, status=status.HTTP_201_CREATED)




# instead of "Disconnecting", OV calls it unconnecting LMAO
class Unconnect(APIView):
    def post(self, request, friend_id):
        friend = get_object_or_404(User, pk=friend_id)
        connection_list = get_object_or_404(ConnectionList, user=request.user)

        if not connection_list.is_mutual_connection(friend):
            return Response({"error": "This user is not your connection."}, status=status.HTTP_400_BAD_REQUEST)

        connection_list.unfriend(friend)
        return Response({"message": "Connection removed."}, status=status.HTTP_200_OK)