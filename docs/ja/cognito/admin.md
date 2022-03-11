## strapi-plugin-admin Cognito User Pool連携の仕様

### 管理画面について
Googleアカウントの説明と同様です。[リンク](../google/admin.md)の[管理画面について]を参照


### 認証の流れ
プラグインが適切にインストールされている場合、`strapi routes:list |grep strapi-plugin-sso`コマンドを実行すると認証のために必要なパスの一覧を確認できます。

Cognito User Pool連携には`GET  /strapi-plugin-sso/cognito`と`GET /strapi-plugin-sso/cognito/callback`の2つを使用します。

[セットアップ](setup.md)が完了していれば、Webブラウザから`/strapi-plugin-sso/cognito`にアクセスすると既にCognito User Poolを連携することが可能です。

### ユーザーの制限
Googleアカウント連携と異なり、strapi-plugin-ssoではCognitoのメールアドレスドメインの制御ができません。

従って、**Cognitoの設定でアカウント登録をユーザー側に許可しない設定をすることを推奨します。**

手順はCognitoの[全般設定]セクションの[ポリシー]を開き、[管理者のみにユーザーの作成を許可する]にチェックを入れます。

これによって不特定多数のユーザーがアカウントを登録、ログインを行えないようにできます。

※或いはCognitoのトリガーからLambdaを設定することで特定のユーザーに制限することも可能ですが、プラグインの範疇を超えるため詳しくは[AWS公式 サインアップ前のLambdaトリガー](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html) をご覧ください。

### Webhooks
こちらもGoogleアカウントと同様の仕様のため、[こちら](../google/admin.md)をご覧ください

### 設定値の一覧

最後にCognito SSOで設定可能な設定の一覧を記します。

|  キー |  必須 | デフォルト値 |
| --- | -- | ---- |
| COGNITO_OAUTH_CLIENT_ID | ○ | - |
| COGNITO_OAUTH_CLIENT_SECRET | ○ | - |
| COGNITO_OAUTH_DOMAIN | ○ | - |
| COGNITO_OAUTH_REDIRECT_URI | - | http://localhost:1337/strapi-plugin-sso/cognito/callback |
| COGNITO_OAUTH_REGION | - | ap-northeast-1 |
