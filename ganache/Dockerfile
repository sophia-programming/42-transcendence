# ベースイメージとして Node.js を使用
FROM node:18

# 必要なパッケージをインストール
RUN apt-get update && \
    apt-get install -y curl && \
    npm install -g ganache-cli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# データ保存用ディレクトリの作成
RUN mkdir -p /data

# Ganache CLI を起動
CMD ["ganache-cli", "--host", "0.0.0.0", "--db", "/data"]

# ポートの公開
EXPOSE 8545
