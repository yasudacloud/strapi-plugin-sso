## strapi-plugin-admin Googleアカウント連携の仕様

### 管理画面について
まず、既存のSuper Admin権限を持ったユーザーで管理画面にログインし、 左サイドメニューのstrapi-plugin-ssoを押下します。

この設定画面はGoogleアカウントやCognitoユーザープールで初めてログインを行なった時のデフォルトの権限を設定します。

例えば、GoogleのEditorにチェックを入れて保存を行います。
それ以降に特定のGoogleアカウントで初めてログインを行うとEditor権限が付与されます。

**ただし、既にGoogleアカウントと同じメールアドレスが存在していた場合は新たにアカウントは作成されません。**

デフォルトの挙動ではメールアドレスが同一かどうかで判定しているため、既にメールアドレス＆パスワードを使って登録されている場合はそのユーザーでログインすることになります。

また、その際は新たにアカウントを作成するわけではないので権限や姓名といった項目は元のアカウントの設定のままになります。（上書きされない）

### 認証の流れ
プラグインが適切にインストールされている場合、`strapi routes:list |grep strapi-plugin-sso`コマンドを実行すると認証のために必要なパスの一覧を確認できます。

Googleアカウント連携には`GET  /strapi-plugin-sso/google`と`GET /strapi-plugin-sso/google/callback`の2つを使用します。

[セットアップ](setup.md)が完了していれば、Webブラウザから`/strapi-plugin-sso/google`にアクセスすると既にGoogleアカウントを連携することが可能です。

### 既存のメールアドレスとGoogleのメールアドレスを分けたい場合
前述の通り、デフォルトの設定ではメールアドレスによってアカウントが紐づいてしまいます。

この問題は `GOOGLE_ALIAS`を設定することで回避できます。
例えば`プロジェクトルート/config/plugins.js` に以下のように設定します。

```javascript
module.exports = {
  // ...その他の設定
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      // ...
      GOOGLE_ALIAS: '123'
    }
  },
}
```

この状態でGoogleアカウント`example@gmail.com`が認証を行なった場合、`example+123@gmail.com` というメールアドレスでStrapiに新規アカウントとして作成されます。

※strapi-plugin-ssoを運用し始めてから設定を変えてしまうと意図せずアカウントが別に出来てしまうため注意して下さい。

※新規アカウントは通常のStrapiのパスワードポリシーに従った予測困難なパスワードを自動生成して付与しています。

### Googleアカウントの連携制限
デフォルトの設定ではGoogleアカウントを持つユーザーは誰でも登録可能になっています。

Strapiの運用環境（本番環境）は基本的に部外者のアクセス制限を行なっていると思いますが、このプラグインではG Suite利用者向けに制限を加えることができます。

先程と同様、下記のように設定値を追加します。 するとシングルサインオン時に取得するドメインが一致していない場合はエラーを出力します。

```javascript
module.exports = {
  // ...その他の設定
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      // ...
      GOOGLE_GSUITE_HD: 'example.com'
    }
  },
}
```

### Webhooks

Googleアカウントを使用して初めてログインを行なった際に通知を受け取ることが可能です。

具体的には管理画面の[Settings] → [Webhooks]から[Create new webhook]ボタンを押下します。
EventsのEntry行のCREATEにチェックを入れて、それ以外の項目に適切な設定を入れて保存ボタンを押下することで設定完了です。

※ただし、前述の通りGoogleアカウントと同じメールアドレスが既に存在している場合はアカウントが作成されません。そのためWebhookによる通知も発生しません。

### 設定値の一覧

最後にGoogle SSOで設定可能な設定の一覧を記します。


|  キー |  必須 | デフォルト値 |
| --- | -- | ---- |
| GOOGLE_OAUTH_CLIENT_ID | ○ | - |
| GOOGLE_OAUTH_CLIENT_SECRET | ○ | - |
| COGNITO_OAUTH_REDIRECT_URI | - | http://localhost:1337/strapi-plugin-sso/google/callback |
| GOOGLE_ALIAS | - | - |
| GOOGLE_GSUITE_HD | - | - |


スコープは`https://www.googleapis.com/auth/userinfo.email`と`https://www.googleapis.com/auth/userinfo.profile`の2つを必要としています。

アカウントの作成にはメールアドレスと名（first name）が必須のためです。
