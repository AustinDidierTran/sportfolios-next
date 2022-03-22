import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Notification } from '../../../../../../../typescript/notifications';
import { NOTIFICATION_TYPE } from '../../../../../../common/enums';
import moment from 'moment';
import OtherTeamSubmittedAScore from './OtherTeamSubmittedAScore';

interface Props {
  notification: Notification;
}

const Container = styled.div`
  width: 100%;
  background-color: ${(props) => (props.color === 'unread' ? '#F3F4F9' : 'white')};
  border-left: 5px solid ${(props) => (props.color === 'unread' ? props.theme.primary.light : 'white')};
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  min-height: 5rem;
`;

const Image = styled.img`
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 50%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;

  span {
    line-height: 1.375rem;
  }
`;

const supportedTypes: string[] = [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE];

const NotificationCard: React.FunctionComponent<Props> = (props) => {
  const color = useMemo(() => (props.notification.seen_at && 'read') || 'unread', [props.notification.seen_at]);

  if (!supportedTypes.includes(props.notification.type)) {
    console.log(`We do not support this type: ${props.notification.type}`);
    return <></>;
  }

  return (
    <Container color={color}>
      <Image src={props.notification.photoUrl} />
      <Content>
        {(() => {
          if (props.notification.type === NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE) {
            return <OtherTeamSubmittedAScore notification={props.notification} />;
          }

          if (props.notification.type === NOTIFICATION_TYPE.ADDED_TO_EVENT) {
            return <></>;
          }

          if (props.notification.type === NOTIFICATION_TYPE.ADDED_TO_TEAM) {
            return <></>;
          }
          if (props.notification.type === NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM) {
            return <></>;
          }
          if (props.notification.type === NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT) {
            return <></>;
          }
          if (props.notification.type === NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST) {
            return <></>;
          }
          if (props.notification.type === NOTIFICATION_TYPE.PERSON_REGISTRATION) {
            return <></>;
          }
          if (props.notification.type === NOTIFICATION_TYPE.TEAM_REGISTRATION) {
            return <></>;
          }

          return <></>;
        })()}
      </Content>
    </Container>
  );
};

export default NotificationCard;
