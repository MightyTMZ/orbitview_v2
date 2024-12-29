from django.contrib.postgres.search import SearchVector
from django.db.models.signals import post_save
from .models import Post, Article
from django.dispatch import receiver

# Update the search_vector whenever a post is saved
@receiver(post_save, sender=Post)
def update_search_vector(sender, instance, **kwargs):
    instance.search_vector = SearchVector('title', 'content')
    instance.save()


@receiver(post_save, sender=Article)
def update_search_vector(sender, instance, **kwargs):
    instance.search_vector = SearchVector('title', 'content')
    instance.save()