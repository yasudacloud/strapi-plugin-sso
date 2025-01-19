import React, {memo, useEffect, useState} from 'react';
import {
  Box,
  Tabs,
} from '@strapi/design-system';
import {Page, Layouts} from '@strapi/strapi/admin';
import {useIntl} from 'react-intl';
import {useFetchClient} from '@strapi/strapi/admin';
import getTrad from "../../utils/getTrad";
import Role from "../../components/Role";
import Whitelist from "../../components/Whitelist";
import {ErrorAlertMessage, SuccessAlertMessage} from "../../components/AlertMessage";

const HomePage = () => {
  const {formatMessage} = useIntl();
  const [loading, setLoading] = useState(false);

  // Roles
  const [ssoRoles, setSSORoles] = useState([])
  const [roles, setRoles] = useState([])

  // Whitelist
  const [useWhitelist, setUseWhitelist] = useState(false)
  const [users, setUsers] = useState([])

  const [showSuccess, setSuccess] = useState(false)
  const [showError, setError] = useState(false)

  const {get, put, post, del} = useFetchClient();

  useEffect(() => {
    get(`/strapi-plugin-sso/sso-roles`).then((response) => {
      setSSORoles(response.data)
    })
    get(`/admin/roles`).then((response) => {
      setRoles(response.data.data)
    })
    get('/strapi-plugin-sso/whitelist').then(response => {
      setUsers(response.data.whitelistUsers)
      setUseWhitelist(response.data.useWhitelist)
    })
  }, [setSSORoles, setRoles])

  const onChangeRoleCheck = (value, ssoId, role) => {
    for (const ssoRole of ssoRoles) {
      if (ssoRole['oauth_type'] === ssoId) {
        if (ssoRole['role']) {
          if (value) {
            ssoRole['role'].push(role)
          } else {
            ssoRole['role'] = ssoRole['role'].filter(selectRole => selectRole !== role)
          }
        } else {
          ssoRole['role'] = [role]
        }
      }
    }
    setSSORoles(ssoRoles.slice())
  }
  const onSaveRole = async () => {
    try {
      await put('/strapi-plugin-sso/sso-roles', {
        roles: ssoRoles.map(role => ({
          'oauth_type': role['oauth_type'], role: role['role']
        }))
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (e) {
      console.error(e)
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
  }

  const onRegisterWhitelist = async (email) => {
    setLoading(true)
    post('/strapi-plugin-sso/whitelist', {
      email,
    }).then(response => {
      get('/strapi-plugin-sso/whitelist').then(response => {
        setUsers(response.data.whitelistUsers)
        setUseWhitelist(response.data.useWhitelist)
      })
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    })
  }

  const onDeleteWhitelist = async (id) => {
    setLoading(true)
    del(`/strapi-plugin-sso/whitelist/${id}`).then(response => {
      get('/strapi-plugin-sso/whitelist').then(response => {
        setUsers(response.data.whitelistUsers)
        setUseWhitelist(response.data.useWhitelist)
      })
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    })
  }

  return (
    <Page.Protect permissions={[{action: 'plugin::strapi-plugin-sso.read', subject: null}]}>
      <Layouts.Header
        title={'Single Sign On'}
        subtitle={formatMessage({
          id: getTrad('page.title'),
          defaultMessage: 'Default role setting at first login'
        })}
      />
      {
        showSuccess && (
          <SuccessAlertMessage onClose={() => setSuccess(false)}/>
        )
      }
      {
        showError && (
          <ErrorAlertMessage onClose={() => setError(false)}/>
        )
      }
      <Box padding={10}>
        <Tabs.Root defaultValue="role">
          <Tabs.List aria-label="Manage your attribute" style={{maxWidth: 300}}>
            <Tabs.Trigger value="role">{formatMessage({
              id: getTrad('tab.roles'),
              defaultMessage: 'Roles'
            })}</Tabs.Trigger>
            <Tabs.Trigger value="whitelist">{formatMessage({
              id: getTrad('tab.whitelist'),
              defaultMessage: 'Whitelist'
            })}</Tabs.Trigger>
          </Tabs.List>

          {/* Roles Tab */}
          <Tabs.Content value="role" style={{background: 'initial'}}>
            <Role
              roles={roles}
              ssoRoles={ssoRoles}
              onSaveRole={onSaveRole}
              onChangeRoleCheck={onChangeRoleCheck}
            />
          </Tabs.Content>

          {/* Whitelist Tab */}
          <Tabs.Content value="whitelist">
            <Whitelist
              loading={loading}
              users={users}
              useWhitelist={useWhitelist}
              onSave={onRegisterWhitelist}
              onDelete={onDeleteWhitelist}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Page.Protect>
  );
}

export default memo(HomePage);
