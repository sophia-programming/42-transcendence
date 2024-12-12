from rest_framework import serializers

class MatchSerializer(serializers.Serializer):
    winner_id = serializers.IntegerField()
    winner_score = serializers.IntegerField()
    loser_id = serializers.IntegerField()
    loser_score = serializers.IntegerField()