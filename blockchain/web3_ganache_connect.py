from web3 import Web3

# Ganache のサービスに接続
ganache_url = "http://ganache:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# 接続確認
if web3.is_connected():
    print("Successfully connected to Ganache")
else:
    print("Failed to connect to Ganache")