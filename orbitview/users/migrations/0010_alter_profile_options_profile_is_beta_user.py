# Generated by Django 5.1.4 on 2025-01-01 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_profile_industry'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='profile',
            options={'permissions': [('can_edit_own_profile', 'Can edit their own profile')]},
        ),
        migrations.AddField(
            model_name='profile',
            name='is_beta_user',
            field=models.BooleanField(default=True),
        ),
    ]