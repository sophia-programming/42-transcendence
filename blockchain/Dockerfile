# ベースイメージとして Node.js を使用
FROM node:18

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー（存在する場合）
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# Truffleをグローバルにインストール
RUN npm install -g truffle ganache-cli

# プロジェクトのファイルをコンテナにコピー
COPY . .

# Ganache CLI をバックグラウンドで起動し、その後に Truffle migrate を実行
CMD ganache-cli -h 0.0.0.0 & truffle migrate --network development && tail -f /dev/null