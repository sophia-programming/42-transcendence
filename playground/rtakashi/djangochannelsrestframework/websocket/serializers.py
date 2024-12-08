from rest_framework import serializers
from .models import GameState

class GameStateSerializer(serializers.ModelSerializer):
    class Meta:
        from .models import GameState
        model = GameState
        fields = ['id', 'action', 'game_state']
