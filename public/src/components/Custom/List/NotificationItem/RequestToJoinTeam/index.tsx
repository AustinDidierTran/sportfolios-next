import React, { useMemo } from 'react';
import NotificationItem from '../index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';

interface Imetadata {
  teamId: string;
  teamName: string;
  personName: string;
  personSurname: string;
}

interface IProps {
  metadata: Imetadata;
  onClick: () => void;
  created_at: string;
}

const RequestToJoinTeam: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { metadata, onClick, created_at, ...otherProps } = props;

  const { teamId, teamName, personName, personSurname } = metadata;

  const completeName = useMemo(() => {
    if (personSurname) {
      return `${personName} ${personSurname}`;
    }
    return personName;
  }, [personName, personSurname]);

  const description: string = t('request_to_join_team_description', {
    teamName,
    completeName,
  });

  function handleClick(): void {
    if (onClick) {
      onClick();
    }
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
export default RequestToJoinTeam;
