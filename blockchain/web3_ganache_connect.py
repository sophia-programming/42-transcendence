from web3 import Web3
import json

# Ganacheのサービスに接続
ganache_url = "http://ganache:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# 接続確認
if web3.is_connected():
    print("Successfully connected to Ganache")
else:
    print("Failed to connect to Ganache")

# アカウントと秘密鍵の設定(将来的に自動でとってこれるようにしたい)
account_0 = web3.to_checksum_address('0xfD089344cd7cB5890A8b14D5761C709F40691A40')
private_key = '0x410e2482b0e56cf888d67642a9aef8f3e355759bd116074e5f254f7558e55e36'

# デプロイされたコントラクトのアドレスとABIを設定
contract_address = "0x5ba69AA483B8575509F005ECb7e2Fdf2715F72ca"
abi_path = "./blockchain/truffle/build/contracts/Tournament.json"
with open(abi_path, 'r') as f:
    contract_json = json.load(f)  # JSON文字列をPythonの辞書型に変換
    abi = contract_json['abi']    # コントラクトのABIのみを取り出す

# デプロイされたコントラクトのインスタンスを作成
tournament = web3.eth.contract(address=contract_address, abi=abi)
print(f"Contract instance created: {tournament}")

# Djangoからコントラクトを操作する関数を定義
# 例: 新しい試合結果を記録する
def record_match(winner_id, winner_score, loser_id, loser_score):
    nonce = web3.eth.get_transaction_count(account_0)
    transaction = tournament.functions.recordMatch(
        winner_id,
        winner_score,
        loser_id,
        loser_score
    ).build_transaction({
        'from': account_0,
        'nonce': nonce,
        'gas': 2000000,
        'gasPrice': web3.to_wei('50', 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

# 例: 特定の試合結果を取得する
def get_match(match_number):
    return tournament.functions.getMatch(match_number).call()

# 新しい試合結果を記録する
receipt = record_match(1, 10, 2, 5)
receipt2 = record_match(3, 8, 4, 3)

# 特定の試合結果を取得する
match_number = 1
match_data = get_match(match_number)
print(f"Match data: {match_data}")
