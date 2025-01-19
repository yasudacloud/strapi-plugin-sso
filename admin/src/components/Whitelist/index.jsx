import {
  Box,
  Button,
  Divider,
  Field, Flex,
  Grid,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography
} from "@strapi/design-system";
import React, {useCallback, useState} from "react";
import {Check, Plus, Trash, WarningCircle} from "@strapi/icons";
import {Dialog} from '@strapi/design-system';
import getTrad from "../../utils/getTrad";
import {useIntl} from "react-intl";

const LocalizedDate = ({date}) => {
  const userLocale = navigator.language || "en-US";
  return new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
};

export default function Whitelist({users, useWhitelist, loading, onSave, onDelete}) {
  const [email, setEmail] = useState("");
  const {formatMessage} = useIntl();
  const onSaveEmail = useCallback(async () => {
    const emailText = email.trim()
    if (users.some(user => user.email === emailText)) {
      alert(
        formatMessage({
          id: getTrad('tab.whitelist.error.unique'),
          defaultMessage: 'Already registered email address.'
        })
      )
    } else {
      await onSave(emailText)
      setEmail('')
    }
  }, [email, users])

  const isValidEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }, [email])

  return (
    <>
      <Box padding={4}>
        <Typography tag="div">
          {
            useWhitelist && (
              <>
                <Flex>
                  <Check color={'green'}/>
                  &nbsp;
                  {
                    formatMessage({
                      id: getTrad('tab.whitelist.enabled'),
                      defaultMessage: 'Whitelist is currently enabled.'
                    })
                  }
                  <br/>
                </Flex>
                {
                  formatMessage({
                    id: getTrad('tab.whitelist.description'),
                    defaultMessage: 'Only the following email addresses are allowed to authenticate with SSO.'
                  })
                }
              </>
            )
          }
          {
            !useWhitelist && (
              <Flex>
                <WarningCircle color={'#dd0000'}/>
                &nbsp;
                {
                  formatMessage({
                    id: getTrad('tab.whitelist.disabled'),
                    defaultMessage: 'Whitelist is currently disabled.'
                  })
                }
              </Flex>
            )
          }
        </Typography>
        <Grid.Root tag="fieldset" gap={4} padding="0px" gridCols={2} borderWidth={0} marginTop={5} marginBottom={5}>
          <Grid.Item xs={1}>
            <Field.Root>
              <Field.Input
                type={'email'}
                disabled={loading}
                value={email}
                hasError={email && !isValidEmail()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </Field.Root>
            &nbsp;
            <Button
              startIcon={<Plus/>}
              disabled={loading || email.trim() === '' || !isValidEmail()}
              loading={loading}
              onClick={onSaveEmail}
            >
              {
                formatMessage({
                  id: getTrad('page.save'),
                  defaultMessage: 'Save'
                })
              }
            </Button>
          </Grid.Item>
        </Grid.Root>

        <Divider/>
        <Table colCount={4} rowCount={users.length}>
          <Thead>
            <Tr>
              <Th>
                {
                  formatMessage({
                    id: getTrad('tab.whitelist.table.no'),
                    defaultMessage: 'No'
                  })
                }
              </Th>
              <Th>
                {
                  formatMessage({
                    id: getTrad('tab.whitelist.table.email'),
                    defaultMessage: 'Email'
                  })
                }
              </Th>
              <Th>
                {
                  formatMessage({
                    id: getTrad('tab.whitelist.table.created'),
                    defaultMessage: 'Created At'
                  })
                }
              </Th>
              <Th>&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <LocalizedDate date={user.createdAt}/>
                  </Td>
                  <Td>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <IconButton label={'Delete'} withTooltip={false}><Trash/></IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          {
                            formatMessage({
                              id: getTrad('tab.whitelist.delete.title'),
                              defaultMessage: 'Confirmation'
                            })
                          }
                        </Dialog.Header>
                        <Dialog.Body icon={<WarningCircle fill="danger600"/>}>
                          <Typography variant={'delta'}>
                            {
                              formatMessage({
                                id: getTrad('tab.whitelist.delete.description'),
                                defaultMessage: 'Are you sure you want to delete this?'
                              })
                            }
                            <br/>
                            {user.email}
                          </Typography>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.Cancel>
                            <Button fullWidth variant="tertiary">
                              {
                                formatMessage({
                                  id: getTrad('page.cancel'),
                                  defaultMessage: 'Cancel'
                                })
                              }
                            </Button>
                          </Dialog.Cancel>
                          <Dialog.Action>
                            <Button fullWidth variant="danger-light" onClick={() => onDelete(user.id)}>
                              {
                                formatMessage({
                                  id: getTrad('page.ok'),
                                  defaultMessage: 'OK'
                                })
                              }
                            </Button>
                          </Dialog.Action>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </Box>
    </>
  )
}