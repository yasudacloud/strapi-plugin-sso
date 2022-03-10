# Strapi plugin strapi-plugin-sso

This plugin is still under development.
Do not use in a production environment!

[comment]: <> (This plugin enables single sign-on with Strapi version 4.)

[comment]: <> (Support is currently only available for Cognito and Google.)

[comment]: <> (**The authentication method for this plugin is completely different from the features offered in the Gold plan.)

[comment]: <> (Therefore, please note a few things to keep in mind.**)



[comment]: <> (### Google Authentication)

[comment]: <> (#### Required Environment Variables)

[comment]: <> (- GOOGLE_OAUTH_CLIENT_ID)

[comment]: <> (- GOOGLE_OAUTH_CLIENT_SECRET)

[comment]: <> (#### Optional)

[comment]: <> (- GOOGLE_OAUTH_SCOPE &#40;default: "https://www.googleapis.com/auth/userinfo.email"&#41;)

[comment]: <> (- GOOGLE_OAUTH_REDIRECT_URI &#40;default: "http://localhost:1337/strapi-plugin-sso/google/callback"&#41;)

[comment]: <> (- GOOGLE_GSUITE_HD &#40;default null&#41;)

[comment]: <> (### Common Environment)

[comment]: <> (- OAUTH_REDIRECT_URI &#40;default: /admin&#41;)


[comment]: <> (Googleアカウントの初回認証はWebhookのEntry-CREATEがコールされます)

[comment]: <> (### Detailed Samples&#40;English&#41;)

[comment]: <> (- [Google SignIn Sample]&#40;a&#41;)

[comment]: <> (- [Cognito SignIn Sample]&#40;a&#41;)

[comment]: <> (### 詳細サンプル（Japanese）)

[comment]: <> (- [Googleログインのサンプル]&#40;a&#41;)

[comment]: <> (- [Cognitoログインのサンプル]&#40;a&#41;)
