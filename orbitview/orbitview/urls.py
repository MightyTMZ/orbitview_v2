"""
URL configuration for orbitview project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from users.views import CustomLoginAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),
    path('chat/', include('chat.urls')),
    path('content/', include('content.urls')),
    path('social/', include('social.urls')),
    path('notifications/', include('notifications.urls')),
    path('auth/', include('djoser.urls')),
    path("auth/token/", include("djoser.urls.jwt")),
    path("auth/token/login/", CustomLoginAPIView.as_view()),
    # orbitview.net/tom.zhang.official
    path('', include('users.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

