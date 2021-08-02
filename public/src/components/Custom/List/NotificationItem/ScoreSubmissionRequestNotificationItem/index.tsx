import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TABS_ENUM } from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../../actions/goTo';

interface Imetadata {
  eventId: string;
  gameId: string;
  eventName: string;
}

interface IProps {
  metadata: Imetadata;
  onClick: () => void;
  created_at: string;
}

const ScoreSubmissionRequestNotificationItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { metadata, onClick, created_at, ...otherProps } = props;

  const { eventId, gameId, eventName } = metadata;

  function handleClick(): void {
    onClick();
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.SCHEDULE, gameId });
  }

  const description: string = t('score.score_submission_request_notif_description', {
    eventName,
  });

  return (
    <NotificationItem
      {...otherProps}
      created_at={created_at}
      description={description}
      onClick={handleClick}
    />
  );
};
export default ScoreSubmissionRequestNotificationItem;
