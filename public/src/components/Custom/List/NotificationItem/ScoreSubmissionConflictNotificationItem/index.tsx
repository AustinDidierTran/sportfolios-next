import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goToScrollTo, ROUTES } from '../../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';

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

const ScoreSubmissionConflictNotificationItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { metadata, onClick, created_at, ...otherProps } = props;

  const { eventId, gameId, eventName } = metadata;

  const description: string = t('score.score_submission_conflict_notif_description', {
    eventName,
  });

  function handleClick(): void {
    if (onClick) {
      onClick();
    }
    goToScrollTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.EDIT_SCHEDULE }, gameId);
  }

  return (
    <NotificationItem
      {...otherProps}
      description={description}
      created_at={created_at}
      initials={eventName[0]}
      onClick={handleClick}
    />
  );
};
export default ScoreSubmissionConflictNotificationItem;
