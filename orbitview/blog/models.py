from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField
from django.utils.text import slugify


class Annoucement(models.Model):
    title = models.CharField(max_length=255)
    cover_img = models.ImageField(upload_to="media/announcements_cover_images/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self) -> str:
        return f"{self.title}"
    

class Blog(models.Model):
    title = models.CharField(max_length=255)
    hidden = models.BooleanField(default=True)

    # if the blog is hidden, its hidden

    blogs = [
        'OrbitView AI', # Insights and developments in AI technologies driving OrbitView.
        'OrbitView Immersion', # Delving into the world of AR/VR and immersive experiences
        'OrbitView Connection', # Insights and tips on building meaningful connections in the disrupted age of technology
        'OrbitView Nodes', # Stories and updates from OrbitNodes, the local hubs for real-world connections and collaboration (e.g. makerspaces for entrepreneurs) 
        'OrbitView Careers', # Career advice, job market trends, and resources for young professionals to excel in their fields
        'OrbitView Creators', # Highlighting the creators and educators innovating on the OrbitView platform
        'OrbitView Community', # Updates, announcements, and milestones from the vibrant OrbitView user base.
        'OrbitView Labs', # Experimenting with new technologies and features to push the boundaries of what OrbitView offers.

    ]


class Author(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # I finally understand why companies hate it when you try to delete your own profile...

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"



class Article(models.Model):
    @property
    def created_at_date(self):
        return self.created_at.date()
    
    TYPES_OF_ARTICLES = [
        ("B", "Blog"),
        ("TA", "Technical Article"),
        ("WP", "White Paper"),
    ]   

    title = models.CharField(max_length=255, unique=True)
    # Since slug comes from title, the slug must also be unique
    subtitle = models.CharField(max_length=355, default="")
    slug = models.SlugField(default="-", editable=False, max_length=250)
    content = RichTextField()
    preview_content = RichTextField(default="")
    authors = models.ManyToManyField(Author)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True) # to determine if it requires an update, the decision will be made on the frontend and not have to undergo a lot of logic here
    is_published = models.BooleanField(default=False)
    featured_image = models.CharField(max_length=2083, blank=True, null=True)
    label = models.CharField(max_length=5, choices=TYPES_OF_ARTICLES, default="B")

    blog = models.ForeignKey(Blog, on_delete=models.PROTECT, null=True, blank=True)

    # We will default each article to a blog

    def __str__(self) -> str:
        return self.title

        # Django is very picky when it comes to datetime, so we must ensure that minute differences in \
        # creation/update is not a problem

    def get_article_url(self):
        return f'/{self.created_at.date()}/{self.slug}/'
    
    def save(self) -> None:
        self.slug = slugify(self.title)
        super(Article, self).save()

