from rest_framework import serializers

from .models import Match, Player, PlayerMatch, Tournament


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "name"]


class PlayerMatchDetailSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()

    class Meta:
        model = PlayerMatch
        fields = ["id", "player", "score", "is_winner"]


class MatchDetailSerializer(serializers.ModelSerializer):
    player_matches = PlayerMatchDetailSerializer(
        source="playermatch_set", many=True, read_only=True
    )

    class Meta:
        model = Match
        fields = ["id", "match_number", "timestamp", "player_matches"]


class TournamentDetailSerializer(serializers.ModelSerializer):
    matches = MatchDetailSerializer(source="match_set", many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = ["id", "name", "date", "matches"]
