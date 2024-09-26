import axios from 'axios';
import { randomUUID } from 'crypto';

const configValidation = () => {
  const config = strapi.config.get('plugin::strapi-plugin-sso')
  if (config['GOOGLE_OAUTH_CLIENT_ID'] && config['GOOGLE_OAUTH_CLIENT_SECRET']) {
    return config
  }
  throw new Error('GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are required')
}

/**
 * Common constants
 */
const OAUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/auth'
const OAUTH_TOKEN_ENDPOINT = 'https://accounts.google.com/o/oauth2/token'
const OAUTH_USER_INFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v1/userinfo'
const OAUTH_GRANT_TYPE = 'authorization_code'
const OAUTH_RESPONSE_TYPE = 'code'
const OAUTH_SCOPE = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

/**
 * Redirect to Google
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignIn(ctx) {
  const config = configValidation()
  const redirectUri = encodeURIComponent(config['GOOGLE_OAUTH_REDIRECT_URI'])
  const url = `${OAUTH_ENDPOINT}?client_id=${config['GOOGLE_OAUTH_CLIENT_ID']}&redirect_uri=${redirectUri}&scope=${OAUTH_SCOPE}&response_type=${OAUTH_RESPONSE_TYPE}`
  ctx.set('Location', url)
  return ctx.send({}, 302)
}

/**
 * Verify the token and if there is no account, create one and then log in
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignInCallback(ctx) {
  const config = configValidation()
  const httpClient = axios.create()
  const userService = strapi.service('admin::user')
  const tokenService = strapi.service('admin::token')
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth')
  const roleService = strapi.plugin('strapi-plugin-sso').service('role')

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`))
  }

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', config['GOOGLE_OAUTH_CLIENT_ID']);
  params.append('client_secret', config['GOOGLE_OAUTH_CLIENT_SECRET']);
  params.append('redirect_uri', config['GOOGLE_OAUTH_REDIRECT_URI']);
  params.append('grant_type', OAUTH_GRANT_TYPE);

  try {
    const response = await httpClient.post(OAUTH_TOKEN_ENDPOINT, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const userInfoEndpoint = `${OAUTH_USER_INFO_ENDPOINT}?access_token=${response.data.access_token}`
    const userResponse = await httpClient.get(userInfoEndpoint)

    // for GSuite
    if (config['GOOGLE_GSUITE_HD']) {
      if (userResponse.data.hd !== config['GOOGLE_GSUITE_HD']) {
        throw new Error('Unauthorized email address')
      }
    }

    const email = config['GOOGLE_ALIAS'] ? oauthService.addGmailAlias(userResponse.data.email, config['GOOGLE_ALIAS']) : userResponse.data.email
    const dbUser = await userService.findOneByEmail(email)
    let activateUser;
    let jwtToken;

    if (dbUser) {
      // Already registered
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser)
    } else {
      // Register a new account
      const googleRoles = await roleService.googleRoles()
      const roles = googleRoles && googleRoles['roles'] ? googleRoles['roles'].map(role => ({
        id: role
      })) : []

      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers)
      activateUser = await oauthService.createUser(
        email,
        userResponse.data.family_name,
        userResponse.data.given_name,
        defaultLocale,
        roles
      )
      jwtToken = await tokenService.createJwtToken(activateUser)

      // Trigger webhook
      await oauthService.triggerWebHook(activateUser)
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(activateUser)

    // Client-side authentication persistence and redirection
    const nonce = randomUUID()
    const html = oauthService.renderSignUpSuccess(jwtToken, activateUser, nonce)
    ctx.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`)
    ctx.send(html);
  } catch (e) {
    console.error(e)
    ctx.send(oauthService.renderSignUpError(e.message))
  }
}

export default {
  googleSignIn,
  googleSignInCallback
}
