from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    # List notifications for the authenticated user
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    # Mark a notification as read
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'notification marked as read'})

    # Mark a notification as unread
    @action(detail=True, methods=['post'])
    def mark_as_unread(self, request, pk=None):
        notification = self.get_object()
        notification.mark_as_unread()
        return Response({'status': 'notification marked as unread'})

    # Create a notification (optional, for administrative or automated purposes)
    @action(detail=False, methods=['post'])
    def create_notification(self, request):
        user = request.data.get('user')
        notification_type = request.data.get('notification_type')
        message = request.data.get('message')
        # You can extend this by adding more logic to create a notification
        # For now, we'll just create a notification with a static type
        Notification.objects.create(
            user=user, 
            notification_type=notification_type,
            message=message,
            is_read=False
        )
        return Response({'status': 'notification created'}, status=status.HTTP_201_CREATED)
