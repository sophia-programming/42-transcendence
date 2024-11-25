from django.contrib.auth import get_user_model
from pong.utils import Base64ImageField
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(read_only=True)
    avatar = Base64ImageField(
        max_length=None, use_url=True, required=False, allow_null=True
    )

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = "__all__"
