from rest_framework import serializers
from .models import GameSetting

# class GameSettingSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = GameSetting
# 		fields = '__all__'

class GameSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSetting
        fields = ['ball_velocity', 'ball_size', 'map']
        
	# GETはデフォルトで実装されている

    def update(self, instance, validated_data):
        """
        PUTメソッド用の更新ロジック
        """
        # データを更新(データがない場合は元のデータを使う)
        instance.ball_velocity = validated_data.get('ball_velocity', instance.ball_velocity)
        instance.ball_size = validated_data.get('ball_size', instance.ball_size)
        instance.map = validated_data.get('map', instance.map)
        instance.save()
        # 更新したインスタンスを返す
        return instance
