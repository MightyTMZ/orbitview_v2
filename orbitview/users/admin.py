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
    # readonly_fields = ['user']

    def get_form(self, request, obj=None, **kwargs):
        """Restrict fields for beta users."""
        form = super().get_form(request, obj, **kwargs)
        # Restrict editable fields dynamically if needed
        if request.user.is_superuser:
            self.fields = [
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
                'is_beta_user',  # Another example field
            ]
        else:
            # Fields for non-superusers (beta users)
            self.fields = [
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

        return form
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset  # Superusers can see all
        elif request.user.is_authenticated and request.user.is_beta_user:
            return queryset.filter(id=request.user.id)  # Beta users can only see their own profile
        return queryset.none()  # Non-beta users see nothing

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True  # Superusers can change anything
        if obj is not None and obj.id == request.user.id:
            return True  # Users can edit their own profiles
        return False
    



