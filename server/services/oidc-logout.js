const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

// The refresh token of the user's last OIDC sign-in, kept until they log out.
const storeKey = (userId) => `oidc_refresh_token_${userId}`;

export default ({strapi}) => {
  const store = () => strapi.store({type: 'plugin', name: 'strapi-plugin-sso'});
  const config = () => strapi.config.get('plugin::strapi-plugin-sso');

  return {
    isEnabled() {
      return Boolean(config()['OIDC_LOGOUT_ENDPOINT']);
    },

    async saveSession(userId, refreshToken) {
      if (!this.isEnabled() || !refreshToken) {
        return;
      }
      await store().set({key: storeKey(userId), value: refreshToken});
    },

    // Ends the provider session started at sign-in, so that the next OIDC
    // sign-in asks for credentials again instead of reusing it.
    async endSession(userId) {
      const refreshToken = await store().get({key: storeKey(userId)});
      if (!refreshToken) {
        return;
      }
      await store().delete({key: storeKey(userId)});

      const {OIDC_LOGOUT_ENDPOINT, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET} = config();
      if (!OIDC_LOGOUT_ENDPOINT) {
        return;
      }

      const params = new URLSearchParams();
      params.append('client_id', OIDC_CLIENT_ID);
      params.append('client_secret', OIDC_CLIENT_SECRET);
      params.append('refresh_token', refreshToken);

      try {
        const response = await fetch(OIDC_LOGOUT_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': FORM_URL_ENCODED},
          body: params,
        });
        // 400 means the provider session had already expired.
        if (!response.ok && response.status !== 400) {
          strapi.log.warn(`OIDC logout failed with status code ${response.status}`);
        }
      } catch (e) {
        // The Strapi logout has already happened and must not fail because of this.
        strapi.log.warn(`OIDC logout failed: ${e.message}`);
      }
    },
  };
};
