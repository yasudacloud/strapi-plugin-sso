# Specification of the management screen and back-end side

## About the Administration Screen
Click on the sidebar, strapsi-plugin-sso in the admin panel.

This screen allows you to set which privileges will be granted by default when you authenticate for the first time with single sign-on.

For example, if you check the "Editor" checkbox in Google, users linked to your Google account will have Editor privileges.

**However, if the same email address as your Google account is already registered, the account will not be created.In that case, the existing email address, name, and permissions will be used to log in**


## If you do not want to merge with an existing email address

The configuration value `GOOGLE_ALIAS` can be used to avoid integration. 

Suppose that `123` is set in GOOGLE_ALIAS. Even if `example@gmail.com` is already registered, the single sign-on e-mail address will be registered with `example+123@gmail.com`.

## Single Sign-On User Restrictions
I believe Strapi's admin screen is basically access restricted.
However, anyone can register by accessing the single sign-on login URL.

To solve this problem, set `GOOGLE_GSUITE_HD`.

This allows you to control the domain of the email address using the primary domain you have set up in GSuite.


## Webhooks
Some may still have concerns about registering for an account. In such cases, the use of Webhook is recommended.

Webhook notifications can be sent the first time a user logs in with a Google account.

## Available setting values

|  Key |  required | default |
| --- | -- | ---- |
| GOOGLE_OAUTH_CLIENT_ID | ✅ | - |
| GOOGLE_OAUTH_CLIENT_SECRET | ✅ | - |
| COGNITO_OAUTH_REDIRECT_URI | - | http://localhost:1337/strapi-plugin-sso/google/callback |
| GOOGLE_ALIAS | - | - |
| GOOGLE_GSUITE_HD | - | - |

Two scopes are used: `https://www.googleapis.com/auth/userinfo.email` and `https://www.googleapis.com/auth/userinfo.profile`.
