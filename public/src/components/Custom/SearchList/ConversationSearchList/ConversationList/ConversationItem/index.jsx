import React, { useMemo, useContext } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Store } from '../../../../../../Store';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import styles from './ConversationItem.module.css';
import { goTo, ROUTES } from '../../../../../../actions/goTo';
import CustomAvatar from '../../../../Avatar';

export default function ConversationItem(props) {
  const { t } = useTranslation();
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  const {
    id,
    onClick,
    selected,
    photoUrl,
    name,
    completeName,
    secondary,
    icon,
    inverseColor,
    secondaryActions, //secondaryAction is an array of components, this array should not contain more than 2 or 3 buttons
    notClickable,
    disabled,
    item,
  } = props;
  console.log(item);
  const participants = useMemo(() => {
    return item.participants
      .filter((participant) => participant.id !== userInfo?.primaryPerson?.id)
      .map((participant) => `${participant.name} ${participant.surname}`)
      .join(', ');
  }, [item.name, item.participants]);

  const photoUrl = useMemo(() => {
    if (!item.participants.length) {
      return;
    }
    const possiblePictures = item.participants
      .filter((p) => p.id !== userInfo?.primaryPerson?.personId)
      .map((o) => o.photoUrl)
      .filter((o) => o !== null);

    if (!possiblePictures || possiblePictures.length === 0) {
      return null;
    }
    const randomPhoto = possiblePictures[Math.floor(Math.random() * possiblePictures.length)];
    return randomPhoto;
  }, [item.participants]);

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        if (item.name) {
          onClick(e);
        } else {
          onClick(e);
        }
      }
    },
    [id, onClick]
  );

  const className = useMemo(() => {
    if (inverseColor) {
      return styles.avatar;
    }
    return null;
  }, [inverseColor]);

  return (
    <div className={styles.listItem}>
      <ListItem
        button
        selected={selected}
        onClick={notClickable ? null : handleClick}
        style={{
          width: '100%',
          secondaryAction: {
            paddingRight: 96,
          },
        }}
        disabled={disabled}
      >
        <ListItemIcon>
          <CustomAvatar className={className} photoUrl={photoUrl} icon={icon} />
        </ListItemIcon>
        <ListItemText
          className={styles.text}
          primary={item.name || participants}
          secondary={secondary || t('person.person')}
        />
        <ListItemSecondaryAction>
          {secondaryActions ? (
            <div className={styles.secondaryActions}>
              {secondaryActions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
}
