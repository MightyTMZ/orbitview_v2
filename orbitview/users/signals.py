from django.db.models import Value
from django.db.models.functions import Concat
from django.contrib.postgres.search import SearchVector
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

'''@receiver(post_save, sender=Profile)
def update_user_search_vector(sender, instance, **kwargs):
    # Access the user's fields directly via the instance
    user_full_name = Concat(
        Value(instance.user.username),  # Access user fields directly from the instance
        Value(' '),  # Add a space separator
        Value(instance.user.first_name),
        Value(' '),
        Value(instance.user.last_name),
        Value(' '),
        Value(instance.bio), 
        Value(' '),
        Value(instance.by_line),
    )
    
    # Use the concatenated string for the search vector
    instance.search_vector = SearchVector(user_full_name)
    
    print(f'Search vector for {sender} is saved')
    instance.save()
'''