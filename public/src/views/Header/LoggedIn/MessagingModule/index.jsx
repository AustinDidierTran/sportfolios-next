import React, { useEffect, useState, useContext } from 'react';
import api from '../../../../actions/api';
import { IconButton } from '../../../../components/Custom';
import { SOCKET_EVENT, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import { Store } from '../../../../Store';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../../utils/colors';

export default function MessagingModule(props) {
  const { className, onClick } = props;
  const {
    state: { isAuthenticated, socket },
  } = useContext(Store);
  const { t } = useTranslation();

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  /*
  useEffect(() => {
    socket.on(SOCKET_EVENT.MESSAGES, (count) => {
      setUnreadMessagesCount(count);
    });
    return () => {
      socket.off(SOCKET_EVENT.MESSAGES);
    };
  }, []);
*/
  const toggleMessaging = () => {
    /*
    api('/api/notifications/see', {
      //CHOSES À COMPLÉTÉ 2
      method: 'PUT',
    });
    */
    setUnreadMessagesCount(0);
    onClick();
  };

  const getMessagingCount = async () => {
    /*
    const res = await api('/api/notifications/unseenCount', { method: 'GET' });
    if (res.status == REQUEST_STATUS_ENUM.SUCCESS) {
      setUnreadMessagesCount(Number(res.data));
    }
    */
  };

  useEffect(() => {
    if (isAuthenticated) getMessagingCount();
  }, [isAuthenticated]);

  return (
    <IconButton
      className={className}
      onClick={toggleMessaging}
      icon="Chat"
      style={{ color: COLORS.white }}
      size="medium"
      tooltip={t('messages')}
      withBadge
      badgeContent={unreadMessagesCount}
      aria-label={`show ${unreadMessagesCount} new messages`}
    />
  );
}
