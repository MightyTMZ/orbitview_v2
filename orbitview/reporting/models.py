from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class ReportedItem(models.Model):

    REPORT_REASONS = [
        ("spam", "Spam"),
        ("inappropriate", "Inappropriate Content"),
        ("abuse", "Abuse or Harassment"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, help_text="The user who reported this item.")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) 
    # Let's say that a video was deemed not appropriate...

    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey() # help_text="The type of content being reported (e.g., Video, Comment)."

    created_at = models.DateTimeField(auto_now_add=True)


    # this will be the field that the user can use to specify the "Other" reason as to why they reported the content
    # users can also further explain their reason here

    additional_details = models.TextField(
        max_length=2000, 
        null=True, 
        blank=True, 
        help_text="Additional details provided by the user."
    )
