from django.contrib import admin

from .models import Match, Player, PlayerMatch, Tournament

admin.site.register(Player)
admin.site.register(PlayerMatch)
admin.site.register(Match)
admin.site.register(Tournament)
