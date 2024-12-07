from django.contrib import admin

# Register your models here.

from .models import GameStatus
class GameStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'game_status')

admin.site.register(GameStatus, GameStatusAdmin)
