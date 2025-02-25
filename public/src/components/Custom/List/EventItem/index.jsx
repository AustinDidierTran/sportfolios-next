import React, { useCallback } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CustomAvatar from '../../Avatar';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function EventItem(props) {
  const { t } = useTranslation();

  const { id, onClick, selected, photoUrl, name } = props;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      goTo(ROUTES.entity, { id });
    }
  }, [id, onClick]);

  return (
    <ListItem button onClick={handleClick} selected={selected} style={{ width: '100%' }}>
      <ListItemIcon>
        <CustomAvatar photoUrl={photoUrl} />
      </ListItemIcon>
      <ListItemText primary={name} secondary={t('event.event')} />
    </ListItem>
  );
}
