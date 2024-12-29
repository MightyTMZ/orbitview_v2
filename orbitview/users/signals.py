from django.db.models import F, Value
from django.db.models.functions import Concat
from django.contrib.postgres.search import SearchVector
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=Profile)
def update_user_search_vector(sender, instance, **kwargs):
    # Concatenate user fields into a single string
    user_full_name = Concat(
        F('user__username'),
        Value(' '),  # Add a space separator
        F('user__first_name'),
        Value(' '),
        F('user__last_name'),
        Value(' '),
        F('bio')
    )
    
    # Use the concatenated string for the search vector
    instance.search_vector = SearchVector(user_full_name)
    
    print(f'Search vector for {sender} is saved')
    instance.save()
