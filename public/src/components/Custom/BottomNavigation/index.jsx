import React, { useContext, useMemo, useState, useEffect } from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './BottomNavigation.module.css';
import CustomIcon from '../Icon';
import Badge from '@material-ui/core/Badge';

import { useTranslation } from 'react-i18next';

import { ROUTES, goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';
import api from '../../../actions/api';
import { SOCKET_EVENT, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { useWindowSize } from '../../../hooks/window';

const TABS_ENUM = {
  HOME: 'home',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  MENU: 'menu',
};

export default function CustomBottomNavigation() {
  const { t } = useTranslation();
  const {
    state: { userInfo, socket },
  } = useContext(Store);

  const [width] = useWindowSize();

  const [value, setValue] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  socket.on(SOCKET_EVENT.NOTIFICATIONS, (count) => {
    setUnreadNotificationsCount(count);
  });

  const routeEnum = {
    [TABS_ENUM.HOME]: [ROUTES.home],
    [TABS_ENUM.PROFILE]: [
      ROUTES.entity,
      {
        id: userInfo && userInfo.primaryPerson && userInfo.primaryPerson.personId,
      },
    ],
    [TABS_ENUM.NOTIFICATIONS]: [ROUTES.notifications],
    [TABS_ENUM.MENU]: [ROUTES.menu],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    goTo(...routeEnum[newValue]);
  };

  const displayNav = useMemo(
    () => width < MOBILE_WIDTH && Boolean(userInfo && userInfo.userId),
    [width, userInfo && userInfo.userId]
  );

  const fetchUnreadNotificationsCount = async () => {
    const res = await api('/api/notifications/unseenCount', { method: 'GET' });
    if (res.status == REQUEST_STATUS_ENUM.SUCCESS) {
      setUnreadNotificationsCount(Number(res.data));
    }
  };

  useEffect(() => {
    if (displayNav) {
      fetchUnreadNotificationsCount();
    }
  }, [displayNav]);

  return displayNav ? (
    <BottomNavigation value={value} onChange={handleChange} className={styles.bottomnavigation}>
      <BottomNavigationAction label={t('home')} value={TABS_ENUM.HOME} icon={<CustomIcon icon="Home" />} />
      <BottomNavigationAction label={t('profile')} value={TABS_ENUM.PROFILE} icon={<CustomIcon icon="Person" />} />
      <BottomNavigationAction
        label={t('notifications')}
        value={TABS_ENUM.NOTIFICATIONS}
        onClick={() => setUnreadNotificationsCount(0)}
        icon={
          <Badge badgeContent={unreadNotificationsCount} color="error">
            <CustomIcon icon="Notifications" />
          </Badge>
        }
      />
      <BottomNavigationAction label={t('menu')} value={TABS_ENUM.MENU} icon={<CustomIcon icon="Menu" />} />
    </BottomNavigation>
  ) : null;
}
