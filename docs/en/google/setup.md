# Single sign-on using Google account

First, follow README.md to install the plugin to Strapi Version 4.

A sample local environment is shown below.

## 1. GCP Settings
You must access GCP and create OAuth credentials.

[https://console.developers.google.com/](https://console.developers.google.com/)

[Credentials] -> [+ CREATE CREDENTIALS] -> [OAuth client ID]

[Application type] -> [WebApplication]

[Authorized JavaScript origins] -> [+ ADD URI] -> "http://localhost:1337"

[Authorized redirect URIs] -> [+ ADD URI] -> "http://localhost:1337/strapi-plugin-sso/google/callback"

[CREATE]

## 2. Plugin Settings

### editing) config/plugins.js
```javascript
module.exports = ({env}) => ({
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      // Google
      GOOGLE_OAUTH_CLIENT_ID: '[Client ID created in GCP]',
      GOOGLE_OAUTH_CLIENT_SECRET: '[Client Secret created in GCP]',
      GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/google/callback', // URI after successful login
      GOOGLE_ALIAS: '', // Gmail Aliases
      GOOGLE_GSUITE_HD: '', // G Suite Primary Domain
    }
  }
})
```

## 3. Sign in with your Google account
```
http://localhost:1337/strapi-plugin-sso/google
```
If you can see the authentication screen for your Google account and then log in to the administration screen, you are done!

**Caution. If there is no required setting such as GOOGLE_OAUTH_CLIENT_ID or aGOOGLE_OAUTH_CLIENT_SECRET, an error will occur.**
