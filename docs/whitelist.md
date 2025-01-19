# strapi-plugin-sso

## About whitelist

Enabling the whitelist restricts authentication for the strapi-plugin-sso to pre-defined email addresses only.

For compatibility with other versions, this feature is disabled by default.

## How to use it?

To enable, configure as follows

```
// config/plugins.js

export default () => ({
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      USE_WHITELIST: true // <- explicitly set to true
      
      // other settings omitted.
    }
  },
}
```

## Lastly
If you enable the whitelist without preparation, you will lose access to the system.

Make sure to add users from the administration page first!

