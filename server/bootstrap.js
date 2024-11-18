'use strict';

module.exports = async ({strapi}) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'webunal-login',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
