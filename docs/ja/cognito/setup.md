## Cognito User Poolを使ったシングルサインオンについて

### 前提
このプラグインはStrapi Version4で動作することを確認しています。

具体的にはGoogleアカウントとCognitoユーザープールでシングルサインオンが可能です。

ローカル環境に構築する際の手順を次に記します。

## Cognitoの設定
AWS ユーザープールの作成は省略し、アプリクライアントの作成から説明します。
アプリクライアントは[クライアントシークレットを生成]にチェックを入れることが必要で、それ以外の項目は適切な設定をしてください。（全て動作します）

### アプリクライアントの設定
作成後は[アプリクライアントの設定]を開き、有効なIDプロバイダの[Cognito User Pool]にチェックを入れます。

次にコールバックURLに`http://localhost:1337/strapi-plugin-sso/cognito/callback` を入力します。

[許可されている OAuth フロー]の[Authorization code grant]にチェックを入れます。

[許可されているOAuthスコープ]のemailとopenid、profileにチェックを入れて保存します。

### ドメイン名
左メニューから[ドメイン名]を開き、[ドメインのプレフィックス]に適切な値を入力して保存します。

Cognito側の設定はこれで完了です。


## Strapiのプラグイン設定

プロジェクトルート/config/plugins.js に下記を追記します。（当該ファイルが無ければ作成して下さい）

```javascript
module.exports = {
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      COGNITO_OAUTH_CLIENT_ID: 作成したCognitoのクライアントID,
      COGNITO_OAUTH_CLIENT_SECRET: 作成したCognitoのクライアントシークレット,
      COGNITO_OAUTH_DOMAIN: ドメインのプレフィックス名,
      COGNITO_OAUTH_REGION: Cognitoのリージョン名
    }
  },
}
```

## Strapiの起動
コマンドラインから一度`strapi build`を行なってから、`strapi develop`を実行して下さい。
問題なく起動し、`http://localhost:1337/admin` にログインまで出来ればセットアップは完了です。

※ buildは全員に必要な操作ではありませんが、プラグインを編集するユーザーが適切に反映されないリスクを解消できます。
