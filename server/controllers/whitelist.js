async function info(ctx) {
  const config = strapi.config.get('plugin::strapi-plugin-sso');
  const useWhitelist = config['USE_WHITELIST'] === true;
  let whitelistUsers = []
  const whitelistService = strapi.plugin('strapi-plugin-sso').service('whitelist')
  whitelistUsers = await whitelistService.getUsers();
  ctx.body = {
    useWhitelist,
    whitelistUsers
  };
}

async function register(ctx) {
  const {email} = ctx.request.body;
  if (!email) {
    ctx.body = {
      message: 'Please enter a valid email address',
    }
  }
  const whitelistService = strapi.plugin('strapi-plugin-sso').service('whitelist')
  await whitelistService.registerUser(email)

  ctx.body = {}
}

async function removeEmail(ctx) {
  const {id} = ctx.params
  const whitelistService = strapi.plugin('strapi-plugin-sso').service('whitelist')
  await whitelistService.removeUser(id)
  ctx.body = {}
}

export default {
  info,
  register,
  removeEmail
}
