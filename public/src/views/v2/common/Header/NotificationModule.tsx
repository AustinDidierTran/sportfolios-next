import React, { useCallback, useContext } from 'react';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { seeNotifications } from '../../../../actions/service/notifications';
import { ACTION_ENUM, Store } from '../../../../Store';
import Notifications from '@material-ui/icons/Notifications';
import Badge from '../../ForYouPage/components/Badge';

const NotificationModule: React.FunctionComponent = () => {
  const {
    state: { unreadNotificationsCount },
    dispatch,
  } = useContext(Store);

  const onClick = useCallback(() => {
    seeNotifications().then(() => {
      dispatch({
        type: ACTION_ENUM.UPDATE_UNREAD_NOTIFICATIONS_COUNT,
        payload: 0,
      });
      goTo(ROUTES.notifications);
    });
  }, [seeNotifications, dispatch, goTo, ROUTES]);

  return (
    <Badge count={unreadNotificationsCount} onClick={onClick}>
      <Notifications style={{ color: '#707070', height: 32, width: 32 }} height={32} width={32} />
    </Badge>
  );
};

export default NotificationModule;
