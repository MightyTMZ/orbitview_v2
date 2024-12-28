from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostsPagination(PageNumberPagination):
    page_size = 20
    page_size_query_description = "post_count" # /post_count={num}
    max_page_size = 150

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


class ArticlePagination(PageNumberPagination):
    page_size = 10
    page_size_query_description = "article_count" # /post_count={num}
    max_page_size = 150

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


class UserListPagination(PageNumberPagination):
    page_size = 50
    page_query_description = "user_count"
    max_per_size = 150

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })