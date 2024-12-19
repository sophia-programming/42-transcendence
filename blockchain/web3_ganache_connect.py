from web3 import Web3
import json
import os
from eth_account import Account

class TournamentContract:
    def __init__(self, ganache_url="http://ganache:8545", abi_path="blockchain/truffle/build/contracts/Tournament.json", address_path="blockchain/truffle/contract_address.json", mnemonic=None, account_index=0):
        self.ganache_url = ganache_url
        self.abi_path = abi_path
        self.address_path = address_path
        self.mnemonic = mnemonic or os.getenv('GANACHE_MNEMONIC', 'myth like bonus scare over problem client lizard pioneer submit female collect')
        self.account_index = account_index
        self.web3 = self.connect_to_ganache()
        self.account, self.private_key = self.derive_account()
        self.contract = self.get_contract_instance()


    # Ganacheへの接続設定
    def connect_to_ganache(self):
        web3 = Web3(Web3.HTTPProvider(self.ganache_url))
        if web3.is_connected():
            print("Successfully connected to Ganache")
            return web3
        else:
            raise ConnectionError("Failed to connect to Ganache")

    # ファイル読み込み関数
    def load_json_file(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"指定されたファイルが見つかりません: {file_path}")
        try:
            with open(file_path, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError as e:
            raise ValueError(f"JSONの読み込みに失敗しました: {e}")

    # コントラクトのインスタンス作成
    def get_contract_instance(self):
        contract_json = self.load_json_file(self.abi_path)
        abi = contract_json.get('abi')
        if not abi:
            raise KeyError("'abi'キーがJSON内に存在しません")

        address_data = self.load_json_file(self.address_path)
        contract_address = address_data.get('address')
        if not contract_address:
            raise KeyError("'address'キーがJSON内に存在しません")

        return self.web3.eth.contract(address=contract_address, abi=abi)

    # 秘密鍵の導出
    def derive_account(self):
        Account.enable_unaudited_hdwallet_features()

        # パスフレーズの生成
        account_path = f"m/44'/60'/0'/0/{self.account_index}"

        account = Account.from_mnemonic(self.mnemonic, account_path=account_path)
        private_key = account.key
        address = account.address
        print(f"Address: {address}")
        print(f"Private Key: {private_key.hex()}")
        return address, private_key

    # トランザクションのビルドと送信
    def send_transaction(self, contract_function, **kwargs):
        nonce = self.web3.eth.get_transaction_count(self.account)
        transaction = contract_function.build_transaction({
            'from': self.account,
            'nonce': nonce,
            'gas': kwargs.get('gas', 2000000),
            'gasPrice': self.web3.to_wei(kwargs.get('gas_price', '50'), 'gwei')
        })
        signed_txn = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)
        tx_hash = self.web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        return self.web3.eth.wait_for_transaction_receipt(tx_hash)

    # コントラクト操作関数
    def record_match(self, winner_id, winner_score, loser_id, loser_score):
        receipt = self.send_transaction(
            self.contract.functions.recordMatch(winner_id, winner_score, loser_id, loser_score)
        )
        return receipt

    def get_match(self, match_number):
        return self.contract.functions.getMatch(match_number).call()

    # メイン処理
def main():
    tournament = TournamentContract()
    tournament.record_match(1, 10, 2, 5)
    tournament.record_match(3, 8, 4, 3)
    match_data = tournament.get_match(1)
    print(f"Match data: {match_data}")

if __name__ == "__main__":
    main()