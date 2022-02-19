import React, { useState, useEffect, useContext } from 'react';
import Card from '@material-ui/core/Card';
import List from '../../../components/Custom/List';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { useFacebookSDK } from '../../../hooks/setup';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM, APP_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { Store, ACTION_ENUM } from '../../../Store';
import styles from './AppLinking.module.css';
import conf from '../../../../../conf';
import { loadAddEmailConfigGoogle, loadAddEmailConfigFacebook } from '../../../utils/amplify/amplifyConfig';
import { FEATURE_GOOGLE_LOGIN, FEATURE_FACEBOOK_LOGIN } from '../../../../../feature-flags';
import { Auth } from 'aws-amplify';

export default function AppLinking() {
  useFacebookSDK();
  const [, setIsLinkedFB] = useState(false);
  const [, setIsLinkedMessenger] = useState(false);
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedApp] = useState('');
  const [fbUserId, setFBUserId] = useState();

  const fetchConnectedApp = async () => {
    const res = await api('/api/user/connectedApps', { method: 'GET' });
    if (res.status === REQUEST_STATUS_ENUM.ERROR) {
      return;
    }
    const { data } = res;

    if (data) {
      if (data.facebook) {
        setFBUserId(data.facebook.id);
        setIsLinkedFB(data.facebook.connected);
      }
      if (data.messenger) {
        setIsLinkedMessenger(data.messenger.connected);
      }
    }
  };

  useEffect(() => {
    fetchConnectedApp();
  }, []);

  const loginGoogle = async () => {
    loadAddEmailConfigGoogle();
    Auth.federatedSignIn({ provider: 'Google' });
  };

  const loginFacebook = async () => {
    loadAddEmailConfigFacebook();
    Auth.federatedSignIn({ provider: 'Facebook' });
  };

  // const onSuccessfulFBConnection = () => {
  //   window.FB.api('/me', 'GET', { fields: 'id,email,picture,first_name,last_name' }, async function (response) {
  //     const { id: facebook_id, first_name: name, last_name: surname, email, picture } = response;
  //     const res = await api('/api/user/facebookConnection', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         facebook_id,
  //         name,
  //         surname,
  //         email,
  //         picture: picture ? picture.data.url : null,
  //       }),
  //     });
  //     if (res.status === errors[ERROR_ENUM.ACCESS_DENIED].code) {
  //       showErrorToast(t('account_already_linked'));
  //     } else if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
  //       setIsLinkedFB(true);
  //       setFBUserId(facebook_id);
  //     } else {
  //       showErrorToast();
  //       onFBUnlink();
  //     }
  //   });
  // };

  const showErrorToast = (message, duration) => {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: message || t('something_went_wrong'),
      severity: SEVERITY_ENUM.ERROR,
      duration: duration || 4000,
    });
  };

  // const onFBConnectionFailure = () => {
  //   showErrorToast();
  // };

  // const onFBUnlink = () => {
  //   setSelectedApp(APP_ENUM.FACEBOOK);
  //   setAlertDialog(true);
  // };

  const onFBUnlinkConfirmed = async () => {
    const res = await api('/api/user/facebookConnection', {
      method: 'DELETE',
    });
    if (fbUserId == conf.FACEBOOK_ADMIN_ID) {
      setIsLinkedFB(false);
    } else if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      await window.FB.api('/me/permissions', 'DELETE', {}, function (response) {
        if (response.success || response.error.subcode == 466 /*Permissions already revoked*/) {
          window.FB.logout();
          setIsLinkedFB(false);
        } else {
          showErrorToast();
        }
      });
    } else {
      showErrorToast();
    }
    setAlertDialog(false);
  };

  // const openMessenger = () => {
  //   const win = window.open(`https://www.m.me/${conf.FACEBOOK_PAGE_ID}?ref=${userInfo.userId}`, '_blank');
  //   if (win != null) {
  //     win.focus();
  //   }
  // };

  // const onMessengerConnect = async () => {
  //   //if is already linked on facebook, try to link automaticaly by getting his messenger ID
  //   if (fbUserId) {
  //     const res = await api('/api/user/messengerConnection', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         facebook_id: fbUserId,
  //       }),
  //     });
  //     if (res.status == errors[ERROR_ENUM.VALUE_IS_INVALID].code) {
  //       openMessenger();
  //     } else if (res.status == REQUEST_STATUS_ENUM.SUCCESS) {
  //       setIsLinkedMessenger(true);
  //     } else {
  //       showErrorToast();
  //     }
  //   } else {
  //     openMessenger();
  //   }
  // };

  // const onMessengerUnlink = async () => {
  //   setSelectedApp(APP_ENUM.MESSENGER);
  //   setAlertDialog(true);
  // };

  const onMessengerUnlinkConfirmed = async () => {
    const res = await api('/api/user/messengerConnection', {
      method: 'DELETE',
    });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      setIsLinkedMessenger(false);
    } else {
      showErrorToast();
    }
    setAlertDialog(false);
  };

  const items = [
    // {
    //   onConnect: () => {
    //     window.FB.login((response) => loginCallback(response), {
    //       scope: 'public_profile, email',
    //     });
    //   },
    //   onDisconnect: onFBUnlink,
    //   app: APP_ENUM.FACEBOOK,
    //   isConnected: isLinkedFB,
    //   type: LIST_ITEM_ENUM.APP_ITEM,
    //   description: t('facebook_description'),
    //   key: APP_ENUM.FACEBOOK,
    // },
    // {
    //   onConnect: onMessengerConnect,
    //   onDisconnect: onMessengerUnlink,
    //   app: APP_ENUM.MESSENGER,
    //   isConnected: isLinkedMessenger,
    //   type: LIST_ITEM_ENUM.APP_ITEM,
    //   description: t('messenger_description'),
    //   key: APP_ENUM.MESSENGER,
    //   disabled: true,
    // },
  ];

  if (FEATURE_FACEBOOK_LOGIN) {
    items.push({
      onConnect: loginFacebook,
      // onDisconnect: onFBUnlink,
      app: APP_ENUM.FACEBOOK,
      // isConnected: isLinkedFB,
      type: LIST_ITEM_ENUM.APP_ITEM,
      description: t('facebook.add_email'),
      key: APP_ENUM.FACEBOOK,
    });
  }

  if (FEATURE_GOOGLE_LOGIN) {
    items.push({
      onConnect: loginGoogle,
      // onDisconnect: onFBUnlink,
      app: APP_ENUM.GOOGLE,
      // isConnected: isLinkedFB,
      type: LIST_ITEM_ENUM.APP_ITEM,
      description: t('google.add_gmail'),
      key: APP_ENUM.GOOGLE,
    });
  }

  const unlinkConfirmedFunctions = {
    [APP_ENUM.FACEBOOK]: onFBUnlinkConfirmed,
    [APP_ENUM.MESSENGER]: onMessengerUnlinkConfirmed,
  };

  return (
    <>
      <Card className={styles.main}>
        <List title={t('my_apps')} items={items} />
      </Card>
      <AlertDialog
        open={alertDialog}
        description={t('disconnect_app', { appName: selectedApp })}
        onSubmit={unlinkConfirmedFunctions[selectedApp]}
        onCancel={() => setAlertDialog(false)}
      />
    </>
  );
}
