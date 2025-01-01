from django.contrib import admin
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin



@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user__username', 'user__first_name', 'user__last_name', 'user__email']
    
    search_fields = ('user__username',)  # Reference the 'user' field correctly if needed

    fields = [
        'user',
        'location',
        'skills_description',
        'interests_description',
        'currently_working_on',
        'check_in_cycle_length',
        'bio',
        'by_line',
        'date_of_birth',
        'industry',
        'image',
    ]

    def get_form(self, request, obj=None, **kwargs):
        """Restrict fields for beta users and superusers."""
        form = super().get_form(request, obj, **kwargs)
        
        if request.user.is_superuser:
            # Superusers see all fields
            return form
        
        if request.user.groups.filter(name="beta users").exists():
            # Beta users should only edit their own profile
            if obj and obj.id != request.user.id:
                for field in form.base_fields:
                    form.base_fields[field].widget.attrs['disabled'] = 'disabled'  # Disable all fields for non-editable profiles
        return form
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset  # Superusers can see all
        elif request.user.groups.filter(name="beta users").exists():
            return queryset.filter(user=request.user)  # Beta users can only see their own profile
        return queryset.none()  # Non-beta users see nothing

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can change anything
        if obj is not None and obj.user == request.user:
            return True  # Users can edit their own profiles
        return False

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can delete anything
        if obj is not None and obj.user == request.user:
            return True  # Users can delete their own profiles
        return False