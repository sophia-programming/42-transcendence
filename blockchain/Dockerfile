# ベースイメージとして Node.js を使用（Truffleを利用するため）
FROM node:18

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# Truffleと必要な依存関係をインストール
RUN npm install -g truffle ganache-cli

# プロジェクトのファイルをコンテナにコピー
COPY . /app

# 必要なパッケージをインストール

RUN npm install

# Ganache CLI をバックグラウンドで起動し、その後に Truffle migrate を実行
CMD ganache-cli -h 0.0.0.0 & truffle migrate --network development && tail -f /dev/null