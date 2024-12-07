from django.db import models

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return self.name


class Player(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Match(models.Model):
    # on_delete=models.CASCADE：参照先のオブジェクトが削除されたときに、関連するオブジェクトも削除する
    torunament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    match_number = models.PositiveIntegerField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"Match {self.match_number} in {self.torunament.name}"


class PlayerMatch(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    score = models.PositiveIntegerField()
    is_winner = models.BooleanField()

    def __str__(self):
        return f"{self.player.name} in {self.match}"