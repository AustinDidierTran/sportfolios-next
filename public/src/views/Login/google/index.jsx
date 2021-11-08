import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Auth, Hub } from 'aws-amplify';
import '../../../utils/amplify/amplifyConfig.jsx';
import { goTo, ROUTES } from '../../../actions/goTo';
import { loginWithCognitoToken } from '../../../actions/service/auth/auth';
import { ACTION_ENUM, Store } from '../../../Store';

Hub.listen('/.*/', (data) => {
  console.log('hub', data);
  // const { payload } = data;
  // this.onAuthEvent(payload);
  // console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
});

export default function googleLogin() {
  //Auth.federatedSignIn({ provider: 'Google' });
  const { dispatch } = React.useContext(Store);
  React.useEffect(() => {
    verifLogin();
  });

  const verifLogin = async () => {
    const data = await Auth.currentAuthenticatedUser();
    // console.log(data);
    // console.log(data.signInUserSession.idToken.payload.identities[0].providerName);
    const token = data.signInUserSession.idToken.jwtToken;
    if (data.signInUserSession.idToken.payload.identities[0].providerName !== 'Google') {
      goTo(ROUTES.login);
    }
    const user = await loginWithCognitoToken(token);
    if (!user || !user?.data) {
      console.log('user not define');
      goTo(ROUTES.login);
      return;
    }

    if (typeof user?.data === 'string') {
      user.data = JSON.parse(user.data);
    }
    const { userInfo } = user?.data;

    dispatch({
      type: ACTION_ENUM.LOGIN,
      payload: token,
    });
    dispatch({
      type: ACTION_ENUM.UPDATE_USER_INFO,
      payload: userInfo,
    });

    goTo(ROUTES.home);
  };

  return (
    <div>
      <p>Veuillez patienter pendant la validation de votre identite!</p>
    </div>
  );
}
