from django.urls import path
from .views import ProfileDetailAPIView, FollowUserAPIView, FollowRequestManageAPIView

urlpatterns = [
    path('profile/<str:username>/', ProfileDetailAPIView.as_view(), name='profile-detail'),
    path('profile/<str:username>/follow/', FollowUserAPIView.as_view(), name='profile-follow'),
    path('follow-request/<int:request_id>/<str:action>/', FollowRequestManageAPIView.as_view(), name='follow-request-manage'),
]
