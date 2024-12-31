from django.contrib import admin
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin



@admin.register(Profile)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['user__username', 'user__first_name', 'user__last_name', 'user__email']
    
    search_fields = ('user__username',)  # Reference the 'user' field correctly if needed

    # add permissions here'''