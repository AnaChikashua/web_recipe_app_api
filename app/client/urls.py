from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from client.views import LogInView, IndexView, RecipeView, TagsView, IngredientsView

urlpatterns = [
                  path('', LogInView.as_view(), name='login'),
                  path('create/', IndexView.as_view(), name='index'),
                  path('recipes/', RecipeView.as_view(), name='recipes'),
                  path('tags/', TagsView.as_view(), name='tags'),
                  path('ingredients/', IngredientsView.as_view(), name='ingredients'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
