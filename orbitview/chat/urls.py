from django.urls import path
from .views import (
    RoomListCreate,
    RoomDetail,
    ChatListCreate,
    MarkAsSeenAPIView,
)

urlpatterns = [
    path('rooms/', RoomListCreate.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', RoomDetail.as_view(), name='room-detail'),
    path('rooms/<int:room_id>/chats/', ChatListCreate.as_view(), name='chat-list-create'),
    path('rooms/<int:room_id>/chats/seen/', MarkAsSeenAPIView.as_view(), name='mark-as-seen'),
]
