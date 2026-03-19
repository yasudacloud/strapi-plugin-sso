export default async ({strapi}) => {
  const actions = [
    {
      section: 'settings',
      category: 'single sign on',
      displayName: 'Access the SSO settings page',
      uid: 'read',
      pluginName: 'strapi-plugin-sso',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
