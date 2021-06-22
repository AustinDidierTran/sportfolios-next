import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';

interface Imetadata {
  teamId: string;
  teamName: string;
}

interface IProps {
  metadata: Imetadata;
  onClick: () => void;
  created_at: string;
}

const AddedToTeamItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { metadata, onClick, created_at, ...otherProps } = props;

  const { teamId, teamName } = metadata;

  const description: string = t('add.added_to_team_notif_description', {
    teamName,
  });

  function handleClick(): void {
    onClick();
    goTo(ROUTES.entity, { id: teamId });
  }

  return (
    <NotificationItem
      {...otherProps}
      created_at={created_at}
      description={description}
      initials={teamName[0]}
      onClick={handleClick}
    />
  );
};
export default AddedToTeamItem;
