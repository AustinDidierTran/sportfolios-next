import React, { useCallback, useMemo } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import styles from './TeamItem.module.css';
import IconButton from '@material-ui/core/IconButton';
import CustomAvatar from '../../Avatar';
import CustomIcon from '../../Icon';

export default function TeamItem(props) {
  const { t } = useTranslation();

  const {
    id,
    secondary,
    onClick,
    selected,
    photoUrl,
    name,
    isRegistered,
    icon,
    inverseColor,
    notClickable,
    onDelete,
  } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleClick = useCallback(
    (e) => {
      if (notClickable || isRegistered) {
        return;
      }
      if (onClick) {
        onClick(e, { id, name });
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick, name]
  );

  return (
    <ListItem
      button={!isRegistered}
      onClick={handleClick}
      selected={selected}
      style={{
        opacity: isRegistered ? '0.4' : '1',
      }}
    >
      <ListItemIcon>
        {inverseColor ? (
          <CustomAvatar className={styles.avatar} photoUrl={photoUrl} icon={icon} initials={initials}></CustomAvatar>
        ) : (
          <CustomAvatar photoUrl={photoUrl} icon={icon} initials={initials}></CustomAvatar>
        )}
      </ListItemIcon>
      <ListItemText className={styles.text} primary={name} secondary={secondary || t('team')}></ListItemText>
      {onDelete ? (
        <IconButton
          edge="end"
          onClick={() => {
            onDelete(id);
          }}
        >
          <CustomIcon icon="Delete" />
        </IconButton>
      ) : (
        <></>
      )}
    </ListItem>
  );
}
