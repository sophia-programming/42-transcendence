from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

#ModelViewSetを継承したビュークラスを定義
class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.all()        #querysetに対象モデルを宣言
    serializer_class = PostSerializer    #serializer_classに入出力に使うJSON型として宣言