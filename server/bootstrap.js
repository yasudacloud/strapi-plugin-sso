export default async ({strapi}) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'strapi-plugin-sso',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);

  const oidcLogoutService = strapi.plugin('strapi-plugin-sso').service('oidcLogout');
  if (oidcLogoutService.isEnabled()) {
    strapi.eventHub.on('admin.logout', async ({user}) => {
      try {
        await oidcLogoutService.endSession(user.id);
      } catch (e) {
        strapi.log.warn(`OIDC logout failed: ${e.message}`);
      }
    });
  }
};
