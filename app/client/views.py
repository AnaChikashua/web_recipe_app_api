from django.views.generic import TemplateView


class LogInView(TemplateView):
    template_name = 'login.html'


class IndexView(TemplateView):
    template_name = 'index.html'


class RecipeView(TemplateView):
    template_name = 'recipes.html'


class TagsView(TemplateView):
    template_name = 'tags.html'


class IngredientsView(TemplateView):
    template_name = 'ingredients.html'
