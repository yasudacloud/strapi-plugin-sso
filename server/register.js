'use strict';

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'SSO',
    plugin: 'strapi-plugin-sso',
    type: 'Auth',
  });
};
