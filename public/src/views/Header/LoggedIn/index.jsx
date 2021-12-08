import React, { useContext, useMemo, useRef } from 'react';
import { Store, ACTION_ENUM } from '../../../Store';
import { SOCKET_EVENT, HEADER_FLYOUT_TYPE_ENUM, ROUTES_ENUM } from '../../../../common/enums';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchInput from '../../../components/Custom/SearchInput';
import IconButton from '../../../components/Custom/IconButton';
import ProfileChip from '../../../components/Custom/ProfileChip';
import HeaderFlyout from '../HeaderFlyout';
import NotificationModule from './NotificationModule';
import MessagingModule from './MessagingModule';
import useStyles from './useStyles';
import { useTranslation } from 'react-i18next';
import styles from './LoggedIn.module.css';
import { ROUTES, goTo } from '../../../actions/goTo';
import api from '../../../actions/api';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { COLORS } from '../../../utils/colors';
import { FEATURE_MESSAGES_ENABLED } from '../../../../../feature-flags';

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

  const photoUrl = useMemo(() => {
    if (userInfo.primaryPerson) {
      return userInfo.primaryPerson.photoUrl;
    }
    return '';
  }, [userInfo.primaryPerson]);

  const nameObj = useMemo(() => {
    if (userInfo.primaryPerson) {
      return {
        name: userInfo.primaryPerson?.name,
        surname: userInfo.primaryPerson?.surname,
      };
    }
    return '';
  }, [userInfo.primaryPerson]);

  const personId = useMemo(() => {
    if (userInfo.primaryPerson) {
      return userInfo.primaryPerson.personId;
    }
    return '';
  }, [userInfo.primaryPerson?.personId]);

  const totalCartItems = useMemo(() => items.reduce((prev, item) => prev + item.quantity, 0), [items]);

  const updateCart = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems', { method: 'GET' });
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

  const handleConversation = () => {
    goTo(ROUTES.conversations, null, { recipientId: userInfo.primaryPerson.id });
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
                <SearchInput />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  if (!showBar) {
    return null;
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
          <SearchInput />
          <div className={classes.grow} />
          <div className={styles.sectionDesktop}>
            <ProfileChip photoUrl={photoUrl} nameObj={nameObj} entityId={personId} />
            <div ref={refCreateEntity}>
              <IconButton
                className={styles.iconButton}
                icon="Add"
                size="medium"
                onClick={handleCreateClick}
                style={{ color: COLORS.white }}
                tooltip={t('create.create')}
              />
            </div>
            {FEATURE_MESSAGES_ENABLED && (
              <MessagingModule className={styles.iconButton} onClick={handleConversation} />
            )}
            <div></div>
            <div ref={refNotifications}>
              <NotificationModule className={styles.iconButton} onClick={handleNotificationClick} />
            </div>
            <div ref={refAccount}>
              <IconButton
                className={styles.iconButton}
                icon="ArrowDropDown"
                size="medium"
                onClick={handlePlusClick}
                style={{ color: COLORS.white }}
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
