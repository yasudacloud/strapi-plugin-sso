import React, {memo, useEffect, useState} from 'react';
import {HeaderLayout} from '@strapi/design-system/Layout';
import {CheckPermissions} from '@strapi/helper-plugin';
import {useIntl} from 'react-intl';
import {Helmet} from 'react-helmet';
import {Box} from '@strapi/design-system/Box';
import {BaseCheckbox} from '@strapi/design-system/BaseCheckbox'
import {Tbody, Tr, Td, Th} from '@strapi/design-system/Table';
import {Table, Thead} from '@strapi/design-system/Table'
import {Checkbox} from '@strapi/design-system/Checkbox';
import {Button} from '@strapi/design-system/Button';
import {Alert} from '@strapi/design-system/Alert';
import axios from '../../utils/axiosInstance'
import styled from 'styled-components'
import getTrad from "../../utils/getTrad";

const ButtonWrapper = styled.div`
  margin: 10px 0 0 0;

  & button {
    margin: 0 0 0 auto;
  }
`
const Description = styled.p`
  font-size: 16px;
  margin: 20px 0;
`

const AlertMessage = styled.div`
  margin-left: -250px;
  position: fixed;
  left: 50%;
  top: 2.875rem;
  z-index: 10;
  width: 31.25rem;
`

const HomePage = () => {
  const {formatMessage} = useIntl();
  const [ssoRoles, setSSORoles] = useState([])
  const [roles, setRoles] = useState([])
  const [showSuccess, setSuccess] = useState(false)
  const [showError, setError] = useState(false)

  useEffect(async () => {
    const ssoRoleResponse = await axios.get(`/strapi-plugin-sso/sso-roles`)
    setSSORoles(ssoRoleResponse.data)

    const roleResponse = await axios.get(`/admin/roles`)
    setRoles(roleResponse.data.data)
  }, [setSSORoles, setRoles])

  const onChangeCheck = (value, ssoId, role) => {
    for (const ssoRole of ssoRoles) {
      if (ssoRole['oauth-type'] === ssoId) {
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
  const onClickSave = async () => {
    try {
      await axios.put('/strapi-plugin-sso/sso-roles', {
        roles: ssoRoles.map(role => ({
          'oauth-type': role['oauth-type'], role: role['role']
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

  return (
    <CheckPermissions permissions={[{action: 'plugin::strapi-plugin-sso.read', subject: null}]}>
      <Helmet title={'Single Sign On'}/>
      <HeaderLayout
        title={'Single Sign On'}
        subtitle={formatMessage({
          id: getTrad('page.title'),
          defaultMessage: 'Default role setting at first login'
        })}
      />
      <Box padding={10}>
        {
          showSuccess && (
            <AlertMessage>
              <Alert
                title="Success"
                variant={'success'}
                closeLabel={''}
                onClose={() => setSuccess(false)}
              >
                {formatMessage({
                  id: getTrad('page.save.success'),
                  defaultMessage: 'Updated settings'
                })}
              </Alert>
            </AlertMessage>
          )
        }
        {
          showError && (
            <AlertMessage>
              <Alert
                title="Error"
                variant={'danger'}
                closeLabel={''}
                onClose={() => setError(false)}
              >
                {formatMessage({
                  id: getTrad('page.save.error'),
                  defaultMessage: 'Update failed.'
                })}
              </Alert>
            </AlertMessage>
          )
        }
        <Table colCount={roles.length + 1} rowCount={ssoRoles.length}>
          <Thead>
            <Tr>
              <Th>
                {/* Not required, but if it doesn't exist, it's an error. */}
                <BaseCheckbox style={{display: 'none'}}/>
              </Th>
              {
                roles.map(role => (
                  <Th key={role['id']}>
                    {role['name']}
                  </Th>
                ))
              }
            </Tr>
          </Thead>
          <Tbody>
            {
              ssoRoles.map((ssoRole) => (
                <Tr key={ssoRole['oauth-type']}>
                  <Td>{ssoRole['name']}</Td>
                  {
                    roles.map((role) => (
                      <Th key={role['id']}>
                        <Checkbox
                          value={ssoRole['role'] && ssoRole['role'].includes(role['id'])}
                          onValueChange={(value) => {
                            onChangeCheck(value, ssoRole['oauth-type'], role['id'])
                          }}
                        >{''}</Checkbox>
                      </Th>
                    ))
                  }
                </Tr>
              ))
            }
          </Tbody>
        </Table>
        <Description>{formatMessage({
          id: getTrad('page.notes'),
          defaultMessage: 'This will not be reflected for already registered users.'
        })}</Description>
        <ButtonWrapper>
          <Button variant='default' onClick={onClickSave}>{formatMessage({
            id: getTrad('page.save'),
            defaultMessage: 'Save'
          })}</Button>
        </ButtonWrapper>
      </Box>
    </CheckPermissions>
  );
}

export default memo(HomePage);
