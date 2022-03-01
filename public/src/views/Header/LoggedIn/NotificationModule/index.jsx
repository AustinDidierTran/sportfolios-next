import React, { useEffect, useState, useContext } from 'react';
import api from '../../../../actions/api';
import { IconButton } from '../../../../components/Custom';
import { SOCKET_EVENT, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { Store } from '../../../../Store';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../../utils/colors';

export default function NotificationModule(props) {
  const { className, onClick } = props;
  const {
    state: { isAuthenticated, socket },
  } = useContext(Store);
  const { t } = useTranslation();

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    socket.on(SOCKET_EVENT.NOTIFICATIONS, (count) => {
      setUnreadNotificationsCount(count);
    });
    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATIONS);
    };
  }, []);

  const toggleNotification = () => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
    setUnreadNotificationsCount(0);
    onClick();
  };

  const getNotificationCount = async () => {
    const res = await api('/api/notifications/unseenCount', { method: 'GET' });
    if (res.status == REQUEST_STATUS_ENUM.SUCCESS) {
      setUnreadNotificationsCount(Number(res.data));
    }
  };

  useEffect(() => {
    if (isAuthenticated) getNotificationCount();
  }, [isAuthenticated]);

  return (
    <IconButton
      className={className}
      onClick={toggleNotification}
      icon="Notifications"
      style={{ color: COLORS.white }}
      size="medium"
      tooltip={t('notifications.title')}
      withBadge
      badgeContent={unreadNotificationsCount}
      aria-label={`show ${unreadNotificationsCount} new notifications`}
    />
  );
}
