# urls.py
from django.urls import path
from .views import gameplay_data

urlpatterns = [
    path('api/gameplay/', gameplay_data, name='gameplay_data'),
]
