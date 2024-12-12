from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'blockchain')))
from web3_ganache_connect import web3, contract, private_key

from .serializers import MatchSerializer

class TournamentView(LoginRequiredMixin, TemplateView):
    template_name = "tournament/tournament.html"

class RecordMatchView(APIView):
    def post(self, request):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            account = web3.eth.accounts[0]
            nonce = web3.eth.getTransactionCount(account)
            gas_price = web3.toWei('1', 'gwei')

            # ガス代の見積もり
            gas_estimate = contract.functions.recordMatch(
                data["winner_id"],
                data["winner_score"],
                data["loser_id"],
                data["loser_score"]
            ).estimateGas({
                'from': account,
                'nonce': nonce,
                'gasPrice': gas_price
            })

            # ガス代の調整
            gas_limit = int(gas_estimate * 1.1)
            print(f"Gas estimate: {gas_estimate}")

            balance = web3.eth.getBalance(account)
            print(f"Account balance: {web3.fromWei(balance, 'ether')} ETH")


            # トランザクションの構築
            tx = contract.functions.recordMatch(
                data["winner_id"],
                data["winner_score"],
                data["loser_id"],
                data["loser_score"]
            ).buildTransaction({
                'from': account,
                'nonce': nonce,
                'gas': gas_limit,
                'gasPrice': gas_price
            })

            # トランザクションの署名
            signed_tx = web3.eth.account.signTransaction(tx, private_key)

            # トランザクションの送信
            try :
                tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
                return Response({"tx_hash": tx_hash.hex()}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)