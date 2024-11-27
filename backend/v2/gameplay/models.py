from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
   title = models.CharField(max_length=50, default='タイトルなし')
   content = models.TextField()
   user = models.ForeignKey(User, on_delete=models.CASCADE)
   like = models.ManyToManyField(User, related_name='related_post', blank=True)
   created_at = models.DateTimeField(auto_now_add=True)