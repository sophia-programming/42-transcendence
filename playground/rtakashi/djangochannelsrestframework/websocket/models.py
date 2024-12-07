from django.db import models

# Create your models here.

# この二つはユーザー情報のカスタマイズが必要な時に使用。今回はいらないかも？
# from django.contrib.auth.models import AbstractUser
# class User(AbstractUser):
#     pass

# game_status: init,stop,restart
class GameStatus(models.Model):
    game_status = models.CharField(max_length=10)

    def __str__(self):
        return f"GameStatus({self.id} {self.game_status})"
