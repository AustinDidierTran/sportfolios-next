import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';

export default function AddedToEventItem(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;

  const { eventId, teamName, eventName } = metadata;

  const description = t('add.added_to_event_notif_description', {
    teamName,
    eventName,
  });

  function handleClick() {
    if (onClick) {
      onClick();
    }
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.ROSTERS });
  }

  return <NotificationItem {...otherProps} description={description} initials={teamName[0]} onClick={handleClick} />;
}
