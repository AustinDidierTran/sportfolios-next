import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TABS_ENUM } from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../../actions/goTo';

export default function ScoreSubmissionRequestNotificationItem(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;

  const { eventId, gameId, eventName } = metadata;

  function handleClick() {
    if (onClick) {
      onClick();
    }
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.SCHEDULE, gameId });
  }

  const description = t('score.score_submission_request_notif_description', {
    eventName,
  });

  return <NotificationItem {...otherProps} description={description} initials={eventName[0]} onClick={handleClick} />;
}
