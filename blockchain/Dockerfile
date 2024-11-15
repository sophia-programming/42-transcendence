# ベースイメージとして solc を使用
FROM ethereum/solc:0.8.28

# コンテナの作業ディレクトリを設定
WORKDIR /contracts

# スマートコントラクトのソースコードをコンテナにコピー
# ここでは、ホスト側の "contracts" フォルダをイメージ内の "/contracts" フォルダにコピーする
COPY ./contracts /contracts

# コンパイルされたファイルを確認するために、出力先ディレクトリを用意
VOLUME /output

# コンテナ起動時にスマートコントラクトをコンパイルする
ENTRYPOINT ["solc", "--optimize", "--bin", "--abi", "Tournament.sol", "-o", "/output"]
