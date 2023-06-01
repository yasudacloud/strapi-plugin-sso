'use strict';

async function find(ctx) {
  const roleService = strapi.plugin('strapi-plugin-sso').service('role');
  const roles = await roleService.find();
  const ssoConstants = roleService.ssoRoles();
  for (const sso of ssoConstants) {
    for (const role of roles) {
      if (role['oauth_type'] === sso['oauth_type']) {
        sso['role'] = role['roles'];
      }
    }
  }
  ctx.send(ssoConstants);
}

async function update(ctx) {
  try {
    const { roles } = ctx.request.body;
    const roleService = strapi.plugin('strapi-plugin-sso').service('role');
    await roleService.update(roles);
    ctx.send({}, 204);
  } catch (e) {
    console.log(e);
    ctx.send({}, 400);
  }
}

module.exports = {
  find,
  update,
};
