[English](README.md)/日本語

# Amidz

編み図エディター。

<img src="imgs/logo.svg" width="256"></img>

## プロトタイプアプリケーション

このリポジトリのGitHub Pageでは、[プロトタイプアプリケーション](https://kikuomax.github.io/amidz/)を提供しています。
このプロトタイプアプリケーションはProgressive Web App (PWA)です。

### 利用シナリオ

利用シナリオは[こちら](scenarios_ja.md)。

### プロトタイプアプリケーションをローカルでテストする

プロトタイプアプリケーションはローカルでテストできます。
[`/docs/pwa`](/docs/pwa)フォルダにはプロトタプアプリケーションを提供するサーバを`localhost:8000`で走らせるJavaScriptが含まれています。

サーバを起動するには以下のステップを実施してください。

1. [`docs/pwa`](/docs/pwa)に移動します。

    ```
    cd docs/pwa
    ```

2. 必要なモジュールをイントールします。

    ```
    npm install
    ```

3. サービスを起動します。

    ```
    npm start
    ```

4. サーバは http://localhost:8000/ で要求を待ちます。
   以下のようなスクリーンを表示します。

   ![Sample Screen](imgs/sample-screen.png)