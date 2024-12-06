from django.contrib import admin

# Register your models here.

from .models import GameStatus
class GameStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'status')

admin.site.register(GameStatus, GameStatusAdmin)
