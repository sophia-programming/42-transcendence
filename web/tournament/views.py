from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView


class TournamentView(LoginRequiredMixin, TemplateView):
    template_name = "tournament/tournament.html"
