# from django.test import RequestFactory, TestCase
# from ..models import GameSetting
# from ..views import GameSettingViewSet

# class SimpleTest(TestCase):
#     def setUp(self):
#         # リクエストファクトリの初期化
#         self.factory = RequestFactory()
#         # GameSettingインスタンスの作成
#         self.gamesetting = GameSetting.objects.create(
#             ball_velocity="normal",
#             ball_size="normal",
#             map="a",
#         )

#     def test_get(self):
#         # GETリクエストのインスタンスを作成
#         request = self.factory.get("/gameplay/api/gamesetting/")
#         # as_view() を使用してビューを呼び出す
#         response = GameSettingViewSet.as_view({'get': 'list'})(request)
#         self.assertEqual(response.status_code, 200)

#     def test_put(self):
#         # 更新するデータ
#         updated_data = {
#             'ball_velocity': 'fast',
#             'ball_size': 'big',
#             'map': 'b',
#         }
        
#         # PUTリクエストのインスタンスを作成
#         request = self.factory.put(
#             f"/gameplay/api/gamesetting/{self.gamesetting.id}/",  # 正しいURLを指定
#             data=updated_data,
#             content_type='application/json'  # 必要に応じてコンテンツタイプを指定
#         )
        
#         # as_view() を使用してビューを呼び出す
#         response = GameSettingViewSet.as_view({'put': 'update'})(request, pk=self.gamesetting.id)
        
#         # レスポンスステータスコードが200（成功）であることを確認
#         self.assertEqual(response.status_code, 200)
        
#         # データが更新されたことを確認
#         self.gamesetting.refresh_from_db()  # データベースから最新のデータを読み込み
#         self.assertEqual(self.gamesetting.ball_velocity, updated_data['ball_velocity'])
#         self.assertEqual(self.gamesetting.ball_size, updated_data['ball_size'])
#         self.assertEqual(self.gamesetting.map, updated_data['map'])