from django.contrib import admin

# Register your models here.

from .models import GameStatus   # 追加

admin.site.register(GameStatus)  # 追加
