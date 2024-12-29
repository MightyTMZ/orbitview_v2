import os
import django

# Set up the Django environment by specifying the settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "orbitview.settings")  # Adjust if your settings file has a different name
django.setup()

from orbitview.content.models import Post, Article  # Absolute import to models

from django.contrib.postgres.search import SearchVector

def update_search_vectors():
    # Update search_vector for all Post objects
    print("Updating search_vector for posts...")
    posts = Post.objects.all()
    for post in posts:
        # Combine title and content into the search_vector field
        search_vector = SearchVector('title', 'content')
        post.search_vector = search_vector
        post.save()
    
    # Update search_vector for all Article objects
    print("Updating search_vector for articles...")
    articles = Article.objects.all()
    for article in articles:
        # Combine title and content into the search_vector field
        search_vector = SearchVector('title', 'content')
        article.search_vector = search_vector
        article.save()

    print("Search vectors updated successfully!")

# Run the update function
update_search_vectors()
