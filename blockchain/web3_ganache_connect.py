from web3 import Web3
import json
import os

# Ganacheへの接続設定
def connect_to_ganache(url="http://ganache:8545"):
    web3 = Web3(Web3.HTTPProvider(url))
    if web3.is_connected():
        print("Successfully connected to Ganache")
        return web3
    else:
        raise ConnectionError("Failed to connect to Ganache")

# ファイル読み込み関数
def load_json_file(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"指定されたファイルが見つかりません: {file_path}")
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSONの読み込みに失敗しました: {e}")

# コントラクトのインスタンス作成
def get_contract_instance(web3, abi_path, address_path):
    contract_json = load_json_file(abi_path)
    abi = contract_json.get('abi')
    if not abi:
        raise KeyError("'abi'キーがJSON内に存在しません")

    address_data = load_json_file(address_path)
    contract_address = address_data.get('address')
    if not contract_address:
        raise KeyError("'address'キーがJSON内に存在しません")

    return web3.eth.contract(address=contract_address, abi=abi)

# トランザクションのビルドと送信
def send_transaction(web3, contract_function, private_key, account, **kwargs):
    nonce = web3.eth.get_transaction_count(account)
    transaction = contract_function.build_transaction({
        'from': account,
        'nonce': nonce,
        'gas': kwargs.get('gas', 2000000),
        'gasPrice': web3.to_wei(kwargs.get('gas_price', '50'), 'gwei')
    })
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key=private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    return web3.eth.wait_for_transaction_receipt(tx_hash)

# コントラクト操作関数
def record_match(web3, contract, account, private_key, winner_id, winner_score, loser_id, loser_score):
    receipt = send_transaction(
        web3,
        contract.functions.recordMatch(winner_id, winner_score, loser_id, loser_score),
        private_key,
        account
    )
    return receipt

def get_match(contract, match_number):
    return contract.functions.getMatch(match_number).call()

# メイン処理
def main():
    ganache_url = "http://ganache:8545"
    abi_path = "blockchain/truffle/build/contracts/Tournament.json"
    address_path = "blockchain/truffle/contract_address.json"

    # アカウント設定
    account_0 = '0x3fad1900b2a966852ca89B0E39FaBF9696e56d7D'
    private_key = '0xc41271557f5d9cf50a830faea43cbe1fc1dc4a5083637eabe81d7f8d34894cb4'

    # 接続とインスタンス生成
    web3 = connect_to_ganache(ganache_url)
    contract = get_contract_instance(web3, abi_path, address_path)

    # 新しい試合結果を記録
    record_match(web3, contract, account_0, private_key, 1, 10, 2, 5)
    record_match(web3, contract, account_0, private_key, 3, 8, 4, 3)

    # 特定の試合結果を取得
    match_data = get_match(contract, 1)
    print(f"Match data: {match_data}")

if __name__ == "__main__":
    main()
