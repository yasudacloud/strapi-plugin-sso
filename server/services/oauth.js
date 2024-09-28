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

    let storage = "sessionStorage";
    if (REMEMBER_ME) {
      storage = "localStorage";
    }

    return `
<!doctype html>
<html>
<head>
<noscript>
<h3>JavaScript must be enabled for authentication</h3>
</noscript>
<script nonce="${nonce}">
 window.addEventListener('load', function() {

  ${storage}.setItem('jwtToken', '"${jwtToken}"');
  ${storage}.setItem('userInfo', '${JSON.stringify(user)}');
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
});
