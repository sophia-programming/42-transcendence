from django.urls import path
from . import views

app_name = 'createpage'

urlpatterns = [
    path('', views.index, name='index'), 
    path('winner/<str:username>/', views.winner_view, name='winner'),
]