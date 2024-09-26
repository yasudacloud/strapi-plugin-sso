import axios from 'axios';
import { randomUUID } from 'crypto';

const configValidation = () => {
  const config = strapi.config.get('plugin::strapi-plugin-sso')
  if (config['COGNITO_OAUTH_CLIENT_ID'] && config['COGNITO_OAUTH_CLIENT_SECRET'] && config['COGNITO_OAUTH_DOMAIN']) {
    return config
  }
  throw new Error('COGNITO_OAUTH_CLIENT_ID, COGNITO_OAUTH_CLIENT_SECRET AND COGNITO_OAUTH_DOMAIN are required')
}

/**
 * Common constants
 */
const OAUTH_ENDPOINT = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/authorize`
}
const OAUTH_TOKEN_ENDPOINT = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/token`
}
const OAUTH_USER_INFO_ENDPOINT = (domain, region) => {
  return `https://${domain}.auth.${region}.amazoncognito.com/oauth2/userInfo`
}
const OAUTH_GRANT_TYPE = 'authorization_code'
const OAUTH_SCOPE = encodeURIComponent('openid email profile')
const OAUTH_RESPONSE_TYPE = 'code'

async function cognitoSignIn(ctx) {
  const config = configValidation()
  const redirectUri = encodeURIComponent(config['COGNITO_OAUTH_REDIRECT_URI'])
  const endpoint = OAUTH_ENDPOINT(config['COGNITO_OAUTH_DOMAIN'], config['COGNITO_OAUTH_REGION'])
  const url = `${endpoint}?client_id=${config['COGNITO_OAUTH_CLIENT_ID']}&redirect_uri=${redirectUri}&scope=${OAUTH_SCOPE}&response_type=${OAUTH_RESPONSE_TYPE}`
  ctx.set('Location', url)
  return ctx.send({}, 302)
}

async function cognitoSignInCallback(ctx) {
  const config = configValidation()
  const userService = strapi.service('admin::user')
  const tokenService = strapi.service('admin::token')
  const oauthService = strapi.plugin('strapi-plugin-sso').service('oauth')
  const roleService = strapi.plugin('strapi-plugin-sso').service('role')

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`code Not Found`))
  }

  const params = new URLSearchParams();
  params.append('code', ctx.query.code);
  params.append('client_id', config['COGNITO_OAUTH_CLIENT_ID']);
  params.append('client_secret', config['COGNITO_OAUTH_CLIENT_SECRET']);
  params.append('redirect_uri', config['COGNITO_OAUTH_REDIRECT_URI']);
  params.append('grant_type', OAUTH_GRANT_TYPE);

  try {
    const tokenEndpoint = OAUTH_TOKEN_ENDPOINT(config['COGNITO_OAUTH_DOMAIN'], config['COGNITO_OAUTH_REGION'])
    const userInfoEndpoint = OAUTH_USER_INFO_ENDPOINT(config['COGNITO_OAUTH_DOMAIN'], config['COGNITO_OAUTH_REGION'])
    const response = await axios.post(tokenEndpoint, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const userResponse = await axios.get(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`
      }
    })
    if (userResponse.data.email_verified !== 'true') {
      throw new Error('Your email address has not been verified.')
    }

    const dbUser = await userService.findOneByEmail(userResponse.data.email)
    let activateUser;
    let jwtToken;

    if (dbUser) {
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser)
    } else {
      const cognitoRoles = await roleService.googleRoles()
      const roles = cognitoRoles && cognitoRoles['roles'] ? cognitoRoles['roles'].map(role => ({
        id: role
      })) : []

      const defaultLocale = oauthService.localeFindByHeader(ctx.request.headers)
      activateUser = await oauthService.createUser(
        userResponse.data.email,
        '',
        userResponse.data.username,
        defaultLocale,
        roles
      )
      jwtToken = await tokenService.createJwtToken(activateUser)

      // Trigger webhook
      await oauthService.triggerWebHook(activateUser)
    }
    // Login Event Call
    oauthService.triggerSignInSuccess(activateUser)

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
  cognitoSignIn,
  cognitoSignInCallback
}
