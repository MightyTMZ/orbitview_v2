from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:username>/', views.ProfileDetailAPIView.as_view(), name='profile-detail'),
    path('profile/<str:username>/follow/', views.FollowUserAPIView.as_view(), name='profile-follow'),
    path('follow-request/<int:request_id>/<str:action>/', views.FollowRequestManageAPIView.as_view(), name='follow-request-manage'),
    # path('my/following/', views.UserFollowingAPIView.as_view())
    # path('profile')
]


'''

profile/<str:username>/followers/ --> paginated, conditionally returned based on the user's setting (hide_followers_list)
profile/<str:user1>/<str:user2>/followers/mutual/ --> returns their mutual followers (for 2 users only)




'''