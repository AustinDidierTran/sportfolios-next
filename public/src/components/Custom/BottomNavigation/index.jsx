import React, { useContext, useMemo, useState, useEffect } from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './BottomNavigation.module.css';
import { Icon } from '../../Custom';
import { Badge } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import { ROUTES, goTo } from '../../../actions/goTo';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { STATUS_ENUM, SOCKET_EVENT } from '../../../../common/enums';

const TABS_ENUM = {
  HOME: 'home',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  MENU: 'menu',
};

export default function CustomBottomNavigation() {
  const { t } = useTranslation();
  const {
    state: { screenSize, userInfo, socket },
  } = useContext(Store);

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
        id: userInfo && userInfo.primaryPerson && userInfo.primaryPerson.entity_id,
      },
    ],
    [TABS_ENUM.NOTIFICATIONS]: [ROUTES.notifications],
    [TABS_ENUM.MENU]: [ROUTES.menu],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    goTo(...routeEnum[newValue]);
  };

  const displayNav = useMemo(() => screenSize === SCREENSIZE_ENUM.xs && Boolean(userInfo && userInfo.user_id), [
    screenSize,
    userInfo && userInfo.user_id,
  ]);

  const fetchUnreadNotificationsCount = async () => {
    const res = await api('/api/notifications/unseenCount');
    if (res.status == STATUS_ENUM.SUCCESS_STRING) {
      setUnreadNotificationsCount(Number(res.data));
    }
  };

  useEffect(() => {
    fetchUnreadNotificationsCount();
  }, []);

  return displayNav ? (
    <BottomNavigation value={value} onChange={handleChange} className={styles.bottomnavigation}>
      <BottomNavigationAction label={t('home')} value={TABS_ENUM.HOME} icon={<Icon icon="Home" />} />
      <BottomNavigationAction label={t('profile')} value={TABS_ENUM.PROFILE} icon={<Icon icon="Person" />} />
      <BottomNavigationAction
        label={t('notifications')}
        value={TABS_ENUM.NOTIFICATIONS}
        onClick={() => setUnreadNotificationsCount(0)}
        icon={
          <Badge badgeContent={unreadNotificationsCount} color="error">
            <Icon icon="Notifications" />
          </Badge>
        }
      />
      <BottomNavigationAction label={t('menu')} value={TABS_ENUM.MENU} icon={<Icon icon="Menu" />} />
    </BottomNavigation>
  ) : (
    <></>
  );
}
