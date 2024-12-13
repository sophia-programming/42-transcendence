from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from rest_framework.views import APIView
from .serializers import MatchSerializer
from rest_framework.response import Response
from rest_framework import status


class TournamentView(LoginRequiredMixin, TemplateView):
    template_name = "tournament/tournament.html"


class RecordMatchView(APIView):
    def post(self, request):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            # ここでデータを保存する処理を書く
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)