import NotificationItem from '../index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import { TABS_ENUM } from '../../../../../../common/enums';

interface Imetadata {
  eventId: string;
  teamName: string;
  eventName: string;
}

interface IProps {
  metadata: Imetadata;
  onClick: () => void;
  created_at: string;
}

const AddedToEventItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { metadata, onClick, created_at, ...otherProps } = props;

  const { eventId, teamName, eventName } = metadata;

  const description: string = t('add.added_to_event_notif_description', {
    teamName,
    eventName,
  });

  function handleClick(): void {
    onClick();
    goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.ROSTERS });
  }

  return (
    <NotificationItem
      {...otherProps}
      created_at={created_at}
      description={description}
      onClick={handleClick}
    />
  );
};
export default AddedToEventItem;
