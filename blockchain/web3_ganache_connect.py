from web3 import Web3
from solcx import compile_source
from solcx import install_solc
from solcx import set_solc_version

install_solc('0.8.6')  # 必要なバージョンを指定
set_solc_version('0.8.6')  # 使用するバージョンを指定

# Ganacheのサービスに接続
ganache_url = "http://ganache:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# 接続確認
if web3.is_connected():
    print("Successfully connected to Ganache")
else:
    print("Failed to connect to Ganache")

# アカウントと秘密鍵の設定
account_0 = web3.to_checksum_address('0xC44ED185DfaF07489E8c748c330457bBD48821Df')
private_key = '0xbe783fcf43719fcc5efea9063945ae2ae7d62f7f936ee9a73bbb4dc6280937d8'

# スマートコントラクトのソースコード
contract_source_code = '''
pragma solidity >0.5.0;

contract Tournament {
    struct Match {
        uint256 matchNumber;
        uint256 winnerId;
        uint256 winnerScore;
        uint256 loserId;
        uint256 loserScore;
    }

    mapping(uint256 => Match) public matches;
    uint256 public matchCount;
    address public owner;

    event MatchRecorded(
        uint256 matchNumber,
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordMatch(
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    ) public onlyOwner {
        matchCount++;
        matches[matchCount] = Match({
            matchNumber: matchCount,
            winnerId: winnerId,
            winnerScore: winnerScore,
            loserId: loserId,
            loserScore: loserScore
        });

        emit MatchRecorded(
            matchCount,
            winnerId,
            winnerScore,
            loserId,
            loserScore
        );
    }

    function getMatch(uint256 matchNumber) public view returns (
        uint256 winnerId,
        uint256 winnerScore,
        uint256 loserId,
        uint256 loserScore
    ) {
        Match memory m = matches[matchNumber];
        return (m.winnerId, m.winnerScore, m.loserId, m.loserScore);
    }
}
'''

# スマートコントラクトのコンパイル
compiled_sol = compile_source(contract_source_code)
contract_id, contract_interface = compiled_sol.popitem()
bytecode = contract_interface['bin']
abi = contract_interface['abi']

# コントラクトのデプロイ
Tournament = web3.eth.contract(abi=abi, bytecode=bytecode)
nonce = web3.eth.get_transaction_count(account_0)
transaction = Tournament.constructor().build_transaction({
    'from': account_0,
    'nonce': nonce,
    'gas': 20,
    'gasPrice': web3.to_wei('50', 'gwei')
})

# トランザクションに署名
signed_txn = web3.eth.account.sign_transaction(transaction, private_key=private_key)

# トランザクションの送信
tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

# トランザクションの完了を待機
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

# デプロイされたコントラクトのアドレスを取得
contract_address = tx_receipt.contractAddress
print(f"Contract deployed at address: {contract_address}")

# デプロイされたコントラクトのインスタンスを作成
tournament = web3.eth.contract(address=contract_address, abi=abi)
print(f"Contract instance created: {tournament}")

# これらの変数を他のモジュールからインポート可能にする
__all__ = ['web3', 'tournament', 'account_0', 'private_key']

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
        'gas': int(gas_estimate * 1.5),
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
