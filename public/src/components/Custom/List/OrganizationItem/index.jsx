import React, { useCallback, useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import CustomAvatar from '../../Avatar';

export default function OrganizationItem(props) {
  const { t } = useTranslation();
  const { id, onClick, selected, photoUrl, name } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick(e, { id, name });
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick]
  );

  return (
    <ListItem button onClick={handleClick} selected={selected} style={{ width: '100%' }}>
      <ListItemIcon>
        <CustomAvatar photoUrl={photoUrl} initials={initials}></CustomAvatar>
      </ListItemIcon>
      <ListItemText primary={name} secondary={t('organization')}></ListItemText>
    </ListItem>
  );
}
