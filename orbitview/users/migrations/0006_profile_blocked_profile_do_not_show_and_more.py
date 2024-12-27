# Generated by Django 5.1.4 on 2024-12-26 15:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_profile_image'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='blocked',
            field=models.ManyToManyField(blank=True, related_name='blocked_users', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='profile',
            name='do_not_show',
            field=models.ManyToManyField(blank=True, related_name='do_not_show_users', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='profile',
            name='hide_connection_list',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='profile',
            name='restricted',
            field=models.ManyToManyField(blank=True, related_name='restricted_users', to=settings.AUTH_USER_MODEL),
        ),
    ]