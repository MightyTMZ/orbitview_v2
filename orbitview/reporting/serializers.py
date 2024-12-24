from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import ReportedItem


class ReportedItemSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(),
        slug_field='model',
        help_text="The type of content being reported (e.g., 'video', 'comment')."
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ReportedItem
        fields = [
            'id', 
            'user', 
            'content_type', 
            'object_id', 
            'created_at', 
            'additional_details'
        ]
        read_only_fields = ['created_at']

    def validate(self, data):
        if data.get('content_type') and not data.get('object_id'):
            raise serializers.ValidationError("`object_id` must be provided for the given `content_type`.")
        return data