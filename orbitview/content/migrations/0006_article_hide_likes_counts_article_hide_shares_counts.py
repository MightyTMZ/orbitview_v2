# Generated by Django 5.1.4 on 2024-12-25 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0005_article_featured_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='hide_likes_counts',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='article',
            name='hide_shares_counts',
            field=models.BooleanField(default=False),
        ),
    ]
