# ベースイメージとして Node.js を使用
FROM node:18

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー（存在する場合）
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# Truffle をグローバルにインストール
RUN npm install -g truffle

# プロジェクトのファイルをコンテナにコピー
COPY . .

# 作業ディレクトリの設定
WORKDIR /app

# Truffle migrate を実行
CMD ["truffle", "migrate", "--network", "development"]
