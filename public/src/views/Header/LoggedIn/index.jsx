import React, { useContext, useMemo, useRef } from 'react';
import { Store, ACTION_ENUM } from '../../../Store';
import { SOCKET_EVENT, HEADER_FLYOUT_TYPE_ENUM } from '../../../../common/enums';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, SearchInput, ProfileChip } from '../../../components/Custom';
import HeaderFlyout from '../HeaderFlyout';
import NotificationModule from './NotificationModule';
import useStyles from './useStyles';
import { useTranslation } from 'react-i18next';

import styles from './LoggedIn.module.css';
import { ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function LoggedIn(props) {
  const {
    state: {
      userInfo = {},
      socket,
      cart: { items },
    },
    dispatch,
  } = useContext(Store);
  const { showBar = true } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [width] = useWindowSize();

  socket.emit(SOCKET_EVENT.CONNECTED_USER, userInfo.userId);

  const photoUrl = useMemo(() => userInfo.primaryPerson?.photoUrl, [userInfo.primaryPerson]);

  const nameObj = useMemo(
    () => ({
      name: userInfo.primaryPerson?.name,
      surname: userInfo.primaryPerson?.surname,
    }),
    [userInfo.primaryPerson]
  );

  const totalCartItems = useMemo(() => items.reduce((prev, item) => prev + item.quantity, 0), [items]);

  const updateCart = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems');
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: cartItems,
    });
  };

  const handleCreateClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.CREATE,
    });
  };
  const handleNotificationClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.NOTIFICATIONS,
    });
  };
  const handlePlusClick = () => {
    dispatch({
      type: ACTION_ENUM.HEADER_FLYOUT,
      flyoutType: HEADER_FLYOUT_TYPE_ENUM.ACCOUNT,
    });
    updateCart();
  };

  const refCreateEntity = useRef(null);
  const refNotifications = useRef(null);
  const refAccount = useRef(null);

  if (width < MOBILE_WIDTH) {
    // mobile here
    return (
      <div className={classes.grow}>
        <AppBar position="static" className={styles.appBar}>
          <Toolbar className="toolBar">
            <div className={styles.container}>
              <div>
                <SearchInput apiRoute="/api/data/search/previous" />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  if (!showBar) {
    return <></>;
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbarDesktop}>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link href={ROUTES.home} className={classes.titleLink}>
              Sportfolios
            </Link>
          </Typography>
          <SearchInput apiRoute="/api/data/search/previous" />
          <div className={classes.grow} />
          <div className={styles.sectionDesktop}>
            <ProfileChip photoUrl={photoUrl} nameObj={nameObj} entityId={userInfo.primaryPerson?.entityId} />
            <div ref={refCreateEntity}>
              <IconButton
                className={styles.iconButton}
                icon="Add"
                size="medium"
                onClick={handleCreateClick}
                style={{ color: 'white' }}
                tooltip={t('create.create')}
              />
            </div>
            <div ref={refNotifications}>
              <NotificationModule className={styles.iconButton} onClick={handleNotificationClick} />
            </div>
            <div ref={refAccount}>
              <IconButton
                className={styles.iconButton}
                icon="ArrowDropDown"
                size="medium"
                onClick={handlePlusClick}
                style={{ color: 'white' }}
                tooltip={t('account')}
                withBadge
                badgeContent={totalCartItems}
              />
            </div>
            <HeaderFlyout
              refCreateEntity={refCreateEntity}
              refNotifications={refNotifications}
              refAccount={refAccount}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
