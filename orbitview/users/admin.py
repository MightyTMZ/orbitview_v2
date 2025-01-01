from django.contrib import admin
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin



@admin.register(Profile)
class CustomUserAdmin(admin.ModelAdmin):
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
        return form
    



