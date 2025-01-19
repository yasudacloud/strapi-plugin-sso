import {Alert} from "@strapi/design-system";
import getTrad from "../../utils/getTrad";
import React from "react";
import {useIntl} from "react-intl";
import styled from "styled-components";

const AlertMessage = styled.div`
    margin-left: -250px;
    position: fixed;
    left: 50%;
    top: 2.875rem;
    z-index: 10;
    width: 31.25rem;
`

export function SuccessAlertMessage({onClose}) {
  const {formatMessage} = useIntl();
  return (
    <AlertMessage>
      <Alert
        title="Success"
        variant={'success'}
        closeLabel={''}
        onClose={onClose}
      >
        {formatMessage({
          id: getTrad('page.save.success'),
          defaultMessage: 'Updated settings'
        })}
      </Alert>
    </AlertMessage>
  )
}

export function ErrorAlertMessage() {
  const {formatMessage} = useIntl();
  return (
    <AlertMessage>
      <Alert
        title="Error"
        variant={'danger'}
        closeLabel={''}
        onClose={onClose}
      >
        {formatMessage({
          id: getTrad('page.save.error'),
          defaultMessage: 'Update failed.'
        })}
      </Alert>
    </AlertMessage>
  )
}