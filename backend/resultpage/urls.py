from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('winner/<str:username>/', views.winner_view, name='winner'),
]