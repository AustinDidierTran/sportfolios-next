import React, { useMemo, useState, useContext } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import styles from './ParticipantsItem.module.css';
import { goTo, ROUTES } from '../../../../../../actions/goTo';
import CustomAvatar from '../../../../Avatar';
import { Store } from '../../../../../../Store';

export default function ParticipantsItem(props) {
  const { t } = useTranslation();

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
    otherParticipants,
    recipientId,
  } = props;
  console.log('recipientId :', recipientId);
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  const alreadyParticipant = useMemo(() => {
    if (otherParticipants.filter((p) => p.id === id).length === 1) {
      return true;
    }
    if (id === recipientId) {
      return true;
    }
    if (otherParticipants) {
      if (otherParticipants.filter((p) => p.id === id).length === 1) {
        return true;
      }
    }
    return false;
  }, [otherParticipants]);

  const handleClick = useCallback(
    (e) => {
      if (alreadyParticipant) {
        return;
      }
      if (onClick) {
        if (completeName) {
          onClick(e, { id, completeName });
        } else {
          onClick(e, { id, name });
        }
      } else {
        goTo(ROUTES.entity, { id });
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
          opacity: alreadyParticipant ? '0.4' : '1',
        }}
        disabled={disabled}
      >
        <ListItemIcon>
          <CustomAvatar className={className} photoUrl={photoUrl} icon={icon} />
        </ListItemIcon>
        <ListItemText
          className={styles.text}
          primary={completeName || name}
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
