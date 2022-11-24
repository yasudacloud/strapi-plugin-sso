<div align="center">
 <img src="https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/strapi-plugin-sso.png?raw=true" width="180"/>
</div>

# Strapi plugin strapi-plugin-sso

This plugin can provide single sign-on.

You will be able to log in to the administration screen using your Google account or Cognito User Pool.

Currently supports Cognito user pool and Google accounts.

Please read the [documents](#user-content-documentationenglish) for some precautions.

**This plugin is developed by one engineer.**
**If possible, consider using the Gold Plan features.**

# Easy to install
```shell
yarn add strapi-plugin-sso
```
or
```shell
npm i strapi-plugin-sso
```

# Requirements
- Strapi Version4
- **strapi-plugin-sso**
- Google Account or AWS Cognito UserPool

# Example Configuration
```javascript
// config/plugins.js
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
      
      // Cognito
      COGNITO_OAUTH_CLIENT_ID: '[Client ID created in AWS Cognito]',
      COGNITO_OAUTH_CLIENT_SECRET: '[Client Secret created in AWS Cognito]',
      COGNITO_OAUTH_DOMAIN: '[OAuth Domain created in AWS Cognito]',
      COGNITO_OAUTH_REDIRECT_URI: 'http://localhost:1337/strapi-plugin-sso/cognito/callback', //  // URI after successful login
      COGNITO_OAUTH_REGION: 'ap-northeast-1', // AWS Cognito Region 
    }
  }
})
```

# Support
- ✅ NodeJS <= 18.x
- Strapi 4.1.7 or higher

# Documentation(English)

[Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/setup.md)

[Google Single Sign On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/google/admin.md)

[Cognito Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/en/cognito/setup.md)


# Documentation(Japanese)
[Description](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/README.md)

[Google Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/setup.md)

[Google Single Sign-On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/google/admin.md)

[Cognito Single Sign On Setup](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/cognito/setup.md)

[Cognito Single Sign-On Specifications](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/ja/cognito/admin.md)

# Demo
![CognitoDemo](https://github.com/yasudacloud/strapi-plugin-sso/blob/main/docs/demo.gif?raw=true "DemoMovie")
