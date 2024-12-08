from django.db import models

# Create your models here.

# ↓後でgame_state = models.JSONField(help_text="Game state data in JSON format, including players and ball positions.")にしてみる
#     "action": "initialize_game",
#     "game_state": {
#         "players": {
#             "r_player": {"paddle_y": 50},
#             "l_player": {"paddle_y": 50}
#         },
#         "ball": {"x": 50, "y": 50, "vx": 1, "vy": 1}
#     }


class GameState(models.Model):
    action = models.CharField(max_length=50, null=False, default="waiting")
    game_state = models.JSONField()

    def __str__(self):
        return f"GameState(id: {self.id}, action: {self.action})"
