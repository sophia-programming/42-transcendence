from django.contrib import admin
from django.urls import path
from . import views

app_name = "gameplay"
urlpatterns = [
    path('', views.playpage, name="gameplay"),
]
