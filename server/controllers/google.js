const axios = require("axios");
const { v4 } = require("uuid");

const configValidation = () => {
  const config = strapi.config.get("plugin.webunal-login");
  if (
    config["GOOGLE_OAUTH_CLIENT_ID"] &&
    config["GOOGLE_OAUTH_CLIENT_SECRET"]
  ) {
    return config;
  }
  throw new Error(
    "GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are required"
  );
};

/**
 * Common constants
 */
const OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/auth";
const OAUTH_TOKEN_ENDPOINT = "https://accounts.google.com/o/oauth2/token";
const OAUTH_USER_INFO_ENDPOINT =
  "https://www.googleapis.com/oauth2/v1/userinfo";
const OAUTH_GRANT_TYPE = "authorization_code";
const OAUTH_RESPONSE_TYPE = "code";
const OAUTH_SCOPE =
  "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

async function renderLoginPage(ctx) {
  //Cambiar por la página real, redirigir con el botón a  /webunal-login/google.
  ctx.body = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login UNAL</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!-- Importar estilos de la OMD -->
          <link rel="stylesheet" href="https://unal.edu.co/fileadmin/templates/css/unal.css">
          <style>
            .login-container {
              max-width: 1270px;
              margin: 0 auto;
              padding: 1.5rem;
              background-color: var(--TERTIARY_SKY_30);
            }

            .card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              padding: 40px;
              margin: 20px auto;
              max-width: 500px;
            }

            .btn-google {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 70%;
              margin: 20px auto;
              padding: 12px 24px;
              border: none;
              border-radius: 4px;
              background-color: #4285f4;
              color: white;
              font-weight: 500;
              cursor: pointer;
              text-decoration: none;
            }

            .btn-google:hover {
              background-color: #357abd;
            }

            .separator {
              border-top: 1px solid #e0e0e0;
              margin: 20px 0;
            }

            .text-center {
              text-align: center;
            }

            .title {
              color: var(--PRIMARY_B_70);
              font-size: 24px;
              margin-bottom: 16px;
            }

            .description {
              color: var(--NEUTRAL_70);
              margin-bottom: 24px;
            }
          </style>
        </head>
        <body>
          <main class="login-container">
            <div class="card">
              <h4 class="title">Iniciar sesión</h4>
              <p class="description">
                Accede con tu cuenta institucional de la Universidad Nacional de Colombia
              </p>

              <a href="/webunal-login/google" class="btn-google" id="login-link">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#FFFFFF"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#FFFFFF"/>
                  <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FFFFFF"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#FFFFFF"/>
                </svg>
                ACCEDER CON GOOGLE
              </a>

              <div class="separator"></div>

              <div class="text-center">
                <p><strong>¿Problemas para acceder?</strong></p>
                <p>Si tienes problemas para acceder, por favor contacta al administrador del sistema</p>
              </div>
            </div>
          </main>

          <!-- Scripts de la OMD -->
          <script src="https://unal.edu.co/fileadmin/templates/js/unal.js"></script>
        </body>
      </html>
    `;
}

/**
 * Redirect to Google
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignIn(ctx) {
  const config = configValidation();
  const redirectUri = encodeURIComponent(config["GOOGLE_OAUTH_REDIRECT_URI"]);
  const url = `${OAUTH_ENDPOINT}?client_id=${config["GOOGLE_OAUTH_CLIENT_ID"]}&redirect_uri=${redirectUri}&scope=${OAUTH_SCOPE}&response_type=${OAUTH_RESPONSE_TYPE}`;
  ctx.set("Location", url);
  return ctx.send({}, 302);
}

/**
 * Verify the token and if there is no account, create one and then log in
 * @param ctx
 * @return {Promise<*>}
 */
async function googleSignInCallback(ctx) {
  const config = configValidation();
  const httpClient = axios.create();
  const userService = strapi.service("admin::user");
  const tokenService = strapi.service("admin::token");
  const oauthService = strapi.plugin("webunal-login").service("oauth");
  const roleService = strapi.plugin("webunal-login").service("role");

  if (!ctx.query.code) {
    return ctx.send(oauthService.renderSignUpError(`Code not found`));
  }

  const params = new URLSearchParams();
  params.append("code", ctx.query.code);
  params.append("client_id", config["GOOGLE_OAUTH_CLIENT_ID"]);
  params.append("client_secret", config["GOOGLE_OAUTH_CLIENT_SECRET"]);
  params.append("redirect_uri", config["GOOGLE_OAUTH_REDIRECT_URI"]);
  params.append("grant_type", OAUTH_GRANT_TYPE);

  try {
    // Exchange authorization code for access token
    const response = await httpClient.post(OAUTH_TOKEN_ENDPOINT, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Fetch user info from Google
    const userInfoEndpoint = `${OAUTH_USER_INFO_ENDPOINT}?access_token=${response.data.access_token}`;
    const userResponse = await httpClient.get(userInfoEndpoint);

    // For GSuite domain restriction
    if (config["GOOGLE_GSUITE_HD"]) {
      if (userResponse.data.hd !== config["GOOGLE_GSUITE_HD"]) {
        throw new Error("Unauthorized email address");
      }
    }

    // Prepare the email (apply alias if configured)
    const email = config["GOOGLE_ALIAS"]
      ? oauthService.addGmailAlias(
          userResponse.data.email,
          config["GOOGLE_ALIAS"]
        )
      : userResponse.data.email;

    // Check if the user already exists in Strapi
    const dbUser = await userService.findOneByEmail(email);
    let activateUser;
    let jwtToken;

    if (dbUser) {
      // User exists, proceed to login
      activateUser = dbUser;
      jwtToken = await tokenService.createJwtToken(dbUser);

      // Login Event Call
      oauthService.triggerSignInSuccess(activateUser);

      // Client-side authentication persistence and redirection
      const nonce = v4();
      const html = oauthService.renderSignUpSuccess(
        jwtToken,
        activateUser,
        nonce
      );
      ctx.set("Content-Security-Policy", `script-src 'nonce-${nonce}'`);
      ctx.send(html);
    } else {
      // User does not exist, deny access
      const errorMessage =
        "User does not exist. Please contact the administrator.";
      ctx.send(oauthService.renderSignUpError(errorMessage));
    }
  } catch (e) {
    console.error(e);
    ctx.send(oauthService.renderSignUpError(e.message));
  }
}

module.exports = {
  renderLoginPage,
  googleSignIn,
  googleSignInCallback,
};
