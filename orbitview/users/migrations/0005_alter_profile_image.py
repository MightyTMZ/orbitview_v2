# Generated by Django 5.1.4 on 2024-12-25 00:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_profile_check_in_cycle_length_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(blank=True, default='default_pfp.jpg', null=True, upload_to='media/profile_pics'),
        ),
    ]
