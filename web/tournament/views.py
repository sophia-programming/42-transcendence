from django.views.generic import TemplateView


# Create your views here.
class TournamentView(TemplateView):
    template_name = "tournament/tournament.html"
