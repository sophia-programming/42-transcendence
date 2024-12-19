import random

from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Match, Player, Tournament
from .serializers import TournamentDetailSerializer
from .serializers import MatchSaveSerializer


class TournamentRegisterView(APIView):
    def post(self, request):
        player_names = request.data
        if len(player_names) != 8:
            return Response(
                {"error": "Require 8 players"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            tournament = Tournament.objects.create(
                name=f"Tournament {timezone.now().strftime('%Y-%m-%d %H:%M')}",
                date=timezone.now().date(),
            )

            players = [Player.objects.create(name=name) for name in player_names]
            random.shuffle(players)

            for i in range(4):
                Match.objects.create(
                    tournament=tournament,
                    match_number=i + 1,
                    timestamp=timezone.now(),
                    player1=players[i * 2],
                    player2=players[i * 2 + 1],
                    player1_score=0,
                    player2_score=0,
                )

            serializer = TournamentDetailSerializer(tournament)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SaveScoreView(APIView):
    def post(self, request):
        try:
            # クライアントから送信されたデータから試合 ID を取得
            match_id = request.data.get('id')
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)

        # 保存専用シリアライザーを使用
        serializer = MatchSaveSerializer(match, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # 後にここでブロックチェーンへの保存処理を呼び出す
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)