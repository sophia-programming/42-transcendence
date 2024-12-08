from django.test import TestCase
from .models import Tournament, Player, Match, PlayerMatch
from django.utils import timezone

class ModelTests(TestCase):

    def setUp(self):
        # test用のトーナメントとプレイヤーを作成
        self.tournament = Tournament.objects.create(name="Test Tournament", date=timezone.now().date())
        self.player1 = Player.objects.create(name="Player 1")
        self.player2 = Player.objects.create(name="Player 2")

    def test_tournament_creation(self):
        # トーナメントが正しく作成されるか
        self.assertEqual(self.tournament.name, "Test Tournament")

    def test_player_creation(self):
        # プレイヤーが正しく作成されるか
        self.assertEqual(self.player1.name, "Player 1")
        self.assertEqual(self.player2.name, "Player 2")

    def test_match_creation(self):
        # マッチが正しく作成され,トーナメントと関連付けられているか
        match = Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())
        self.assertEqual(match.tournament.name, "Test Tournament")
        self.assertEqual(match.match_number, 1)

    def test_player_match_creation(self):
        # PlayerMatchが正しく作成され,プレイヤーとマッチが関連付けられているか
        match = Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())
        player_match = PlayerMatch.objects.create(player=self.player1, match=match, score=10, is_winner=True)
        self.assertEqual(player_match.player.name, "Player 1")
        self.assertEqual(player_match.match.match_number, 1)
        self.assertEqual(player_match.score, 10)
        self.assertEqual(player_match.is_winner, True)

    def test_unique_match_number_constraint(self):
        # 同じトーナメント内で同じマッチ番号を持つ試合を作成しようとするとエラーが発生するか
        Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())
        with self.assertRaises(Exception):  # IntegrityErrorが発生するはず
            Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())

    def test_cascade_delete(self):
        # マッチが削除されるとそれに関連するPlayerMatchも削除されるか
        match = Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())
        PlayerMatch.objects.create(player=self.player1, match=match, score=10, is_winner=True)

        match_id = match.id  # 削除前に match の ID を取得
        match.delete() 
        
        # match_id を使用して関連する PlayerMatch が存在しないことを確認
        self.assertFalse(PlayerMatch.objects.filter(match_id=match_id).exists())

    def test_winner_assignment(self):
        # 勝者が正しく割り当てられるか
        match = Match.objects.create(tournament=self.tournament, match_number=1, timestamp=timezone.now())
        PlayerMatch.objects.create(player=self.player1, match=match, score=15, is_winner=True)
        PlayerMatch.objects.create(player=self.player2, match=match, score=10, is_winner=False)

        winner = PlayerMatch.objects.get(match=match, is_winner=True)
        self.assertEqual(winner.player, self.player1)