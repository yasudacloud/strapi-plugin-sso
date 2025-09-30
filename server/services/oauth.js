import strapiUtils from "@strapi/utils";
import generator from "generate-password";

export default ({strapi}) => ({
  async createUser(email, lastname, firstname, locale, roles = []) {
    // If the email address contains uppercase letters, convert it to lowercase and retrieve it from the DB. If not, register a new email address with a lower-case email address.
    const userService = strapi.service("admin::user");
    if (/[A-Z]/.test(email)) {
      const dbUser = await userService.findOneByEmail(email.toLocaleLowerCase());
      if (dbUser) {
        return dbUser;
      }
    }

    const createdUser = await userService.create({
      firstname: firstname ? firstname : "unset",
      lastname: lastname ? lastname : "",
      email: email.toLocaleLowerCase(),
      roles,
      preferedLanguage: locale,
    });

    return await userService.register({
      registrationToken: createdUser.registrationToken,
      userInfo: {
        firstname: firstname ? firstname : "unset",
        lastname: lastname ? lastname : "user",
        password: generator.generate({
          length: 43, // 256 bits (https://en.wikipedia.org/wiki/Password_strength#Random_passwords)
          numbers: true,
          lowercase: true,
          uppercase: true,
          exclude: '()+_-=}{[]|:;"/?.><,`~',
          strict: true,
        }),
      },
    });
  },
  addGmailAlias(baseEmail, baseAlias) {
    if (!baseAlias) {
      return baseEmail;
    }
    const alias = baseAlias.replace("/+/g", "");
    const beforePosition = baseEmail.indexOf("@");
    const origin = baseEmail.substring(0, beforePosition);
    const domain = baseEmail.substring(beforePosition);
    return `${origin}+${alias}${domain}`;
  },
  localeFindByHeader(headers) {
    if (headers["accept-language"] && headers["accept-language"].includes("ja")) {
      return "ja";
    } else {
      return "en";
    }
  },
  async triggerWebHook(user) {
    let ENTRY_CREATE
    const webhookStore = strapi.serviceMap.get('webhookStore')
    const eventHub = strapi.serviceMap.get('eventHub')

    if (webhookStore) {
      ENTRY_CREATE = webhookStore.allowedEvents.get('ENTRY_CREATE');
    }
    const modelDef = strapi.getModel("admin::user");
    const sanitizedEntity = await strapiUtils.sanitize.sanitizers.defaultSanitizeOutput({
      schema: modelDef,
      getModel: (uid2) => strapi.getModel(uid2)
    }, user);
    eventHub.emit(ENTRY_CREATE, {
      model: modelDef.modelName,
      entry: sanitizedEntity,
    });
  },
  triggerSignInSuccess(user) {
    delete user["password"];
    const eventHub = strapi.serviceMap.get('eventHub')
    eventHub.emit("admin.auth.success", {
      user,
      provider: "strapi-plugin-sso",
    });
  },
  // Sign In Success
  renderSignUpSuccess(jwtToken, user, nonce) {
    // get REMEMBER_ME from config
    const config = strapi.config.get("plugin::strapi-plugin-sso");
    const REMEMBER_ME = config["REMEMBER_ME"];
    const isRememberMe = !!REMEMBER_ME

    return `
<!doctype html>
<html>
<head>
<noscript>
<h3>JavaScript must be enabled for authentication</h3>
</noscript>
<script nonce="${nonce}">
 window.addEventListener('load', function() {
  if(${isRememberMe}){
    localStorage.setItem('jwtToken', '"${jwtToken}"');
  }else{
    document.cookie = 'jwtToken=${encodeURIComponent(jwtToken)}; Path=/';
  }
  localStorage.setItem('isLoggedIn', 'true');
  location.href = '${strapi.config.admin.url}'
 })
</script>
</head>
<body>
</body>
</html>`;
  },
  // Sign In Error
  renderSignUpError(message) {
    return `
<!doctype html>
<html>
<head></head>
<body>
<h3>Authentication failed</h3>
<p>${message}</p>
</body>
</html>`;
  },
  async generateToken(user, ctx) {
    const sessionManager = strapi.sessionManager;
    if (!sessionManager) {
      throw new Error('sessionManager is not supported. Please upgrade to Strapi v5.24.1 or later.')
    }
    const userId = String(user.id);
    // TODO: A deviceId is generated each time you log in.
    const deviceId = crypto.randomUUID();

    const config = strapi.config.get("plugin::strapi-plugin-sso");
    const REMEMBER_ME = config["REMEMBER_ME"]
    const rememberMe = !!REMEMBER_ME

    const {token: refreshToken} = await sessionManager(
      'admin'
    ).generateRefreshToken(userId, deviceId, {
      type: rememberMe ? 'refresh' : 'session',
    });

    // TODO: reference the Configuration   values
    // https://github.com/strapi/strapi/pull/24346/files#diff-c27336b21ee5785523f7fc802899a5d405da67d12c837c498c4766cb04a50b9aR64
    const cookieOptions = {}
    ctx.cookies.set('strapi_admin_refresh', refreshToken, cookieOptions);

    const accessResult = await sessionManager('admin').generateAccessToken(refreshToken);
    if ('error' in accessResult) {
      throw new Error(accessResult.error);
    }
    const {token: accessToken} = accessResult;
    return accessToken;
  }
});
