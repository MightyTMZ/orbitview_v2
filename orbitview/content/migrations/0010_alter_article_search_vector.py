# Generated by Django 5.1.4 on 2024-12-29 02:58

import django.contrib.postgres.search
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0009_alter_post_search_vector'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='search_vector',
            field=django.contrib.postgres.search.SearchVectorField(blank=True, null=True),
        ),
    ]