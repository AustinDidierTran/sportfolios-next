import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Avatar } from '..';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { goTo, ROUTES } from '../../../actions/goTo';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import styles from './NotificationFactory.module.css';
import api from '../../../actions/api';

export default function FollowNotification(props) {
  const { t } = useTranslation();

  const { closeNotificationModule, first_name, follower, last_name, photoUrl, seen_at } = props;

  const fullName = useMemo(() => `${first_name} ${last_name}`, [first_name, last_name]);

  const text = useMemo(() => t('follow_notification_text', { follower: fullName }), [fullName]);

  const onClick = async () => {
    if (!seen_at) {
      await api('/api/notifications/follow/see', {
        method: 'POST',
        body: JSON.stringify({
          follower,
        }),
      });
    }
    closeNotificationModule();
    goTo(ROUTES.entity, { id: follower });
  };

  return (
    <ListItem button onClick={onClick} key={fullName}>
      <ListItemIcon className={styles.icon}>
        <Avatar className={styles.avatar} photoUrl={photoUrl} />
      </ListItemIcon>
      <ListItemText primary={text} />
      {seen_at ? null : <FiberManualRecordIcon style={{ color: '#54b095' }} />}
    </ListItem>
  );
}
