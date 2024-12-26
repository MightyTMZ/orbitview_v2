from django.urls import path
from .views import (
    ConnectionList,
    SendConnectionRequest,
    ConnectionRequest,
    Unconnect,
    UserConnectionList
)

urlpatterns = [
    path('connections/', ConnectionList.as_view(), name='connection-list'),
    path('connections/<str:username>/', UserConnectionList.as_view(), name='connection-list-by-user'),
    path('connections/request/send/<int:receiver_id>/', SendConnectionRequest.as_view(), name='send-connection-request'),
    path('connections/request/<int:request_id>/<str:action>/', ConnectionRequest.as_view(), name='connection-request-action'),
    path('connections/unconnect/<int:friend_id>/', Unconnect.as_view(), name='unfriend'),
]


'''
connections/<str:username1>/<str: username2>/mutual/ ---> finding mutual connections among people (conditionally rendered) and paginated!

'''