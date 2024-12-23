from django.contrib import admin
from .models import (
    Blog,
    Annoucement, 
    Author, 
    Article,
)

admin.site.register(Blog)
admin.site.register(Annoucement)
admin.site.register(Author)
admin.site.register(Article)