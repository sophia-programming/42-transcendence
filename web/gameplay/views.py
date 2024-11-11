from django.shortcuts import render
from django.views import View


class GameplayView(View):
    def get(self, request):
        return render(request, "gameplay/playpage.html")


playpage = GameplayView.as_view()
