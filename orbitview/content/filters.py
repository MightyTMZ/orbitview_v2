from django_filters import rest_framework as filters
from .models import Post, Article

class PostFilter(filters.FilterSet):
    location_istartswith = filters.CharFilter(field_name='author__profile__location', lookup_expr='istartswith')

    class Meta:
        model = Post
        fields = ['author__profile__industry', 'location_istartswith']


class ArticleFilter(filters.FilterSet):
    location_istartswith = filters.CharFilter(field_name='author__profile__location', lookup_expr='istartswith')

    class Meta:
        model = Article
        fields = ['author__profile__industry', 'location_istartswith']
