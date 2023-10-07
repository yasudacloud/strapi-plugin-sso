const axios = require("axios");
const { v4 } = require('uuid');
const { getService } = require("@strapi/admin/server/utils");

const configValidation = () => {
  const config = strapi.config.get('plugin.strapi-plugin-sso')
  if (config['OIDC_CLIENT_ID'] && config['OIDC_CLIENT_SECRET'] && config['OIDC_ISSUER'] 
      && config['OIDC_REDIRECT_URI'] && config['OIDC_SCOPES']
      && config['OIDC_TOKEN_ENDPOINT'] && config['OIDC_USER_INFO_ENDPOINT'] 
      && config['OIDC_GRANT_TYPE'] && config['OIDC_FAMILY_NAME_FIELD'] 
      && config['OIDC_GIVEN_NAME_FIELD'] && config['OIDC_AUTHORIZATION_ENDPOINT']
      ) {
    return config
  }
  throw new Error('OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_ISSUER, OIDC_REDIRECT_URI, and OIDC_SCOPES are required')
}

const oidcSignIn = async (ctx) => {
  const { state } = ctx.query;
  const { OIDC_CLIENT_ID, OIDC_REDIRECT_URI, OIDC_SCOPES, OIDC_AUTHORIZATION_ENDPOINT } = configValidation();

  const authorizationUrl = `${OIDC_AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${OIDC_CLIENT_ID}&redirect_uri=${OIDC_REDIRECT_URI}&scope=${OIDC_SCOPES}&state=${state}`;

  ctx.redirect(authorizationUrl);
};

const oidcSignInCallback = async (ctx) => {
  const config = configValidation()
  const httpClient = axios.create()
  const tokenService = getService('token')
  const userService = getService('user')
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth')
  const roleService = strapi.plugin('strapi-plugin-sso').service('role')

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`))
  }

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', config['OIDC_CLIENT_ID']);
  params.append('client_secret', config['OIDC_CLIENT_SECRET']);
  params.append('redirect_uri', config['OIDC_REDIRECT_URI']);
  params.append('grant_type', config['OIDC_GRANT_TYPE']);

  try {
    const response = await httpClient.post(config['OIDC_TOKEN_ENDPOINT'], params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const userInfoEndpoint = `${config['OIDC_USER_INFO_ENDPOINT']}?access_token=${response.data.access_token}`
    const userResponse = await httpClient.get(userInfoEndpoint)

   
    const email =  userResponse.data.email
    const dbUser = await userService.findOneByEmail(email)
    let activateUser;
    let jwtToken;

    if (dbUser) {
      // Already registered
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser)
    } else {
      // Register a new account
      const oidcRoles = await roleService.oidcRoles()
      const roles = oidcRoles && oidcRoles['roles'] ? oidcRoles['roles'].map(role => ({
        id: role
      })) : []

      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers)
      activateUser = await oauthService.createUser(
        email,
        userResponse.data[config['OIDC_FAMILY_NAME_FIELD']],
        userResponse.data[config['OIDC_GIVEN_NAME_FIELD']],
        defaultLocale,
        roles,
      )
      jwtToken = await tokenService.createJwtToken(activateUser)

      // Trigger webhook
      await oauthService.triggerWebHook(activateUser)
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(activateUser)

    // Client-side authentication persistence and redirection
    const nonce = v4()
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce)
    ctx.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`)
    ctx.send(html);
  } catch (e) {
    console.error(e)
    ctx.send(oauthService.renderSignUpError(e.message))
  }
};

module.exports = {
  oidcSignIn,
  oidcSignInCallback,
};