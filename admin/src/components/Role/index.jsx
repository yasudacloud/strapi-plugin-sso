import {
  Button,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from '@strapi/design-system';
import getTrad from "../../utils/getTrad";
import React from "react";
import styled from "styled-components";
import {useIntl} from "react-intl";

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

export default function Role({ssoRoles, roles, onSaveRole, onChangeRoleCheck}) {
  const {formatMessage} = useIntl();
  return (
    <>
      <Table colCount={roles.length + 1} rowCount={ssoRoles.length}>
        <Thead>
          <Tr>
            <Th>
              {/* Not required, but if it doesn't exist, it's an error. */}
              <Checkbox style={{display: 'none'}}/>
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
              <Tr key={ssoRole['oauth_type']}>
                <Td>{ssoRole['name']}</Td>
                {
                  roles.map((role) => (
                    <Th key={role['id']}>
                      <Checkbox
                        checked={ssoRole['role'] && ssoRole['role'].includes(role['id'])}
                        onCheckedChange={(value) => onChangeRoleCheck(value, ssoRole['oauth_type'], role['id'])}
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
        <Button variant='default' onClick={onSaveRole}>{formatMessage({
          id: getTrad('page.save'),
          defaultMessage: 'Save'
        })}</Button>
      </ButtonWrapper>
    </>
  )
}