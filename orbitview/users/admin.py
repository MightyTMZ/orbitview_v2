from django.contrib import admin
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin


admin.site.register(Profile)

'''@admin.site.unregister(User)
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active']
    
    list_editable = ['first_name', 'last_name']

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('first_name', 'last_name')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('first_name', 'last_name')}),
    )

    # add permissions here'''