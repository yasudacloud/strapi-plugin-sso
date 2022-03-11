const {getService} = require("@strapi/admin/server/utils");
const strapiUtils = require('@strapi/utils');

module.exports = ({strapi}) => ({
  async createUser(email, lastname, firstname, locale, roles = []) {
    const createdUser = await getService('user').create({
      firstname: firstname ? firstname : 'unset',
      lastname: lastname ? lastname : '',
      email,
      roles,
      preferedLanguage: locale,
    });
    return await getService('user').register({
      registrationToken: createdUser.registrationToken,
      userInfo: {
        firstname: firstname ? firstname : 'unset',
        lastname: lastname ? lastname : 'user',
        password: 'P@ssw0rd', // TODO 複雑なものにする
      }
    });
  },
  addGmailAlias(baseEmail, baseAlias) {
    const alias = baseAlias.replace('/+/g', '')
    const beforePosition = baseEmail.indexOf('@')
    const origin = baseEmail.substring(0, beforePosition)
    const domain = baseEmail.substring(beforePosition)
    return `${origin}+${alias}${domain}`
  },
  localeFindByHeader(headers) {
    if (headers['accept-language'] && headers['accept-language'].includes('ja')) {
      return 'ja'
    } else {
      return 'en'
    }
  },
  async triggerWebHook(user) {
    const {ENTRY_CREATE} = strapiUtils.webhook.webhookEvents;
    const modelDef = strapi.getModel('admin::user');
    const sanitizedEntity = await strapiUtils.sanitize.sanitizers.defaultSanitizeOutput(
      modelDef,
      user
    );
    strapi.eventHub.emit(ENTRY_CREATE, {
      model: modelDef.modelName,
      entry: sanitizedEntity,
    });
  },
  renderSignUpSuccess(jwtToken, user, nonce) {
    return `
<!doctype html>
<html>
<head>
<script nonce="${nonce}">
 window.addEventListener('load', function() {
   sessionStorage.setItem('jwtToken', '"${jwtToken}"');
   sessionStorage.setItem('userInfo', '${JSON.stringify(user)}');
   location.href = '/admin'
 })
</script>
</head>
<body>
認証完了
</body>
</html>`;
  },
  renderSignUpError(message) {
    return `
<!doctype html>
<html>
<head></head>
<body>
<h3>認証に失敗しました</h3>
<p>${message}</p>
</body>
</html>`;
  }
});
