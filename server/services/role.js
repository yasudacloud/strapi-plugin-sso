'use strict';

module.exports = ({strapi}) => ({
  SSO_TYPE_GOOGLE: '1',
  SSO_TYPE_COGNITO: '2',
  ssoRoles() {
    return [{
      'oauth_type': this.SSO_TYPE_GOOGLE,
      name: 'Google'
    }, {
      'oauth_type': this.SSO_TYPE_COGNITO,
      name: 'Cognito'
    }]
  },
  async googleRoles() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findOne({
        'oauth_type': this.SSO_TYPE_GOOGLE
      })
  },
  async cognitoRoles() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findOne({
        'oauth_type': this.SSO_TYPE_COGNITO
      })
  },
  async find() {
    return await strapi
      .query('plugin::strapi-plugin-sso.roles')
      .findMany()
  },
  async update(roles) {
    const query = strapi.query('plugin::strapi-plugin-sso.roles')
    await Promise.all(
      roles.map((role) => {
        return query.findOne({'oauth_type': role['oauth_type']}).then(ssoRole => {
          if (ssoRole) {
            query.update({
              where: {'oauth_type': role['oauth_type']},
              data: {roles: role.role},
            });
          } else {
            query.create({
              data: {
                'oauth_type': role['oauth_type'],
                roles: role.role,
              }
            })
          }
        })
      })
    );
  }
})
