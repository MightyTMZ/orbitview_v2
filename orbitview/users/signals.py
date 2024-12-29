from django.contrib.postgres.search import SearchVector
from django.db.models.signals import post_save
from .models import Profile
from django.dispatch import receiver



@receiver(post_save, sender=Profile)
def update_user_search_vector(sender, instance, **kwargs):
    instance.search_vector = SearchVector(
        'user__username', 
        'user__first_name', 
        'user__last_name', 
        'bio', 
        )
    instance.save()