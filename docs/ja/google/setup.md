## Googleアカウントを使ったシングルサインオンについて

### 前提
このプラグインはStrapi Version4で動作することを確認しています。

具体的にはGoogleアカウントとCognitoユーザープールでシングルサインオンが可能です。

ローカル環境に構築する際の手順を次に記します。

## GCPの設定
[GCP](https://console.developers.google.com/) にアクセスし、[認証情報]から[+認証情報を作成]ボタンを押下し、[OAuth クライアント ID]を選択します。

アプリケーションの種類に[ウェブ アプリケーション]を選択し、[承認済みの JavaScript 生成元]に`http://localhost:1337`を入力します。

[承認済みのリダイレクト URI]にはstrapi-plugin-ssoプラグインのデフォルト値である`http://localhost:1337/strapi-plugin-sso/google/callback` を入力します。

上記を入力し、保存するとクライアントIDとクライアントシークレットが発行されるので次のステップで使用します。

## Strapiのプラグイン設定

プロジェクトルート/config/plugins.js に下記を追記します。（当該ファイルが無ければ作成して下さい）

```javascript
module.exports = {
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      GOOGLE_OAUTH_CLIENT_ID: 作成したGCPのクライアントID,
      GOOGLE_OAUTH_CLIENT_SECRET: 作成したGCPのクライアントシークレット,
    }
  },
}
```

## Strapiの起動
コマンドラインから一度`strapi build`を行なってから、`strapi develop`を実行して下さい。
問題なく起動し、`http://localhost:1337/admin` にログインまで出来ればセットアップは完了です。

※ buildは全員に必要な操作ではありませんが、プラグインを編集するユーザーが適切に反映されないリスクを解消できます。
