from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Profile, FollowRequest
from .serializers import ProfileSerializer, FollowRequestSerializer


class ProfileDetailAPIView(APIView):
    """
    Retrieve or update a user's profile.
    """

    def get(self, request, username):
        profile = get_object_or_404(Profile, user__username=username)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowUserAPIView(APIView):
    """
    Follow a user (handle private and public profiles).
    """

    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, user=target_user)
        sender_profile = get_object_or_404(Profile, user=request.user)

        # If the account is private, create a follow request
        if profile.is_private:
            if FollowRequest.objects.filter(sender=request.user, receiver=target_user).exists():
                return Response({"message": "Follow request already sent."}, status=status.HTTP_400_BAD_REQUEST)
            FollowRequest.objects.create(sender=request.user, receiver=target_user)
            return Response({"message": f"Follow request sent to {username}."}, status=status.HTTP_200_OK)

        # If the account is public, follow directly
        sender_profile.following.add(target_user)
        profile.followers.add(request.user)
        return Response({"message": f"You are now following {username}."}, status=status.HTTP_200_OK)


class FollowRequestManageAPIView(APIView):
    """
    Accept or decline a follow request.
    """

    def post(self, request, request_id, action):
        follow_request = get_object_or_404(FollowRequest, id=request_id)
        if follow_request.receiver != request.user:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        if action == "accept":
            follow_request.is_accepted = True
            follow_request.save()

            # Update followers and following lists
            receiver_profile = get_object_or_404(Profile, user=request.user)
            sender_profile = get_object_or_404(Profile, user=follow_request.sender)

            receiver_profile.followers.add(follow_request.sender)
            sender_profile.following.add(request.user)

            return Response({"message": "Follow request accepted."}, status=status.HTTP_200_OK)

        elif action == "decline":
            follow_request.delete()
            return Response({"message": "Follow request declined."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
