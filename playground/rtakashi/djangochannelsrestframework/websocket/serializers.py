from rest_framework import serializers


class GameStatusSerializer(serializers.ModelSerializer):
    class Meta:
        from .models import GameStatus
        model = GameStatus
        fields = ['id', 'game_status']
