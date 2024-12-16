from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views import View
from rest_framework import viewsets
from .models import GameSetting
from .serializers import GameSettingSerializer

class GameplayView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "gameplay/playpage.html")


playpage = GameplayView.as_view()

class GameSettingViewSet(viewsets.ModelViewSet):
    queryset = GameSetting.objects.all()
    serializer_class = GameSettingSerializer