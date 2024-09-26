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
};
