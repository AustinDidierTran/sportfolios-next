import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Notification } from '../../../../../../../typescript/notifications';
import { NOTIFICATION_TYPE } from '../../../../../../common/enums';
import { formatScore } from '../../../../../utils/stringFormats';

interface Props {
  notification: Notification;
}

const Container = styled.div`
  width: 100%;
  background-color: ${(props) => (props.color === 'unread' ? '#F3F4F9' : 'white')};
  border-left: 5px solid ${(props) => (props.color === 'unread' ? props.theme.primary.light : 'white')};
  display: flex;
  gap: 1.25rem;
`;

const Image = styled.img`
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 50%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationCard: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <Container color="unread">
      <Image src={props.notification.photoUrl} />
      <Content>
        {(() => {
          if (props.notification.type === NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE) {
            return (
              <p>
                {t('confirm_or_decline_score_notif_description', {
                  eventName: props.notification.metadata.eventName,
                  teamName: props.notification.metadata.submittedBy,
                  score: formatScore(JSON.parse(props.notification.metadata.score)),
                })}
              </p>
            );
          }
          return <></>;
        })()}
      </Content>
    </Container>
  );
};

export default NotificationCard;
