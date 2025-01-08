from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class SearchQuery(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="search_queries")
    query = models.CharField(max_length=1500)
    timestamp = models.DateTimeField(auto_now_add=True, editable=False)
    # when a user deletes a "search history" should we actually delete it or not from our systems


