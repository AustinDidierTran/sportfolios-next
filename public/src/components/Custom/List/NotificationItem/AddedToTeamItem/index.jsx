import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';

export default function AddedToTeamItem(props) {
  const { t } = useTranslation();
  const { metadata, onClick, ...otherProps } = props;

  const { teamId, teamName } = metadata;

  const description = t('add.added_to_team_notif_description', {
    teamName,
  });

  function handleClick() {
    if (onClick) {
      onClick();
    }
    goTo(ROUTES.entity, { id: teamId });
  }

  return <NotificationItem {...otherProps} description={description} initials={teamName[0]} onClick={handleClick} />;
}
