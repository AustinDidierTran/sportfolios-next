import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../../../../components/Custom/Container';
import Paper from '../../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import styles from './LoginFacebook.module.css';

import { Auth } from 'aws-amplify';
import '../../../../utils/amplify/amplifyConfig.jsx';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { loginWithCognitoToken } from '../../../../actions/service/auth/auth';
import { ACTION_ENUM, Store } from '../../../../Store';
import { LOGO_ENUM } from '../../../../../common/enums';
import { loadLoginFacebookConfig } from '../../../../utils/amplify/amplifyConfig.jsx';

export default function facebookLogin() {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(Store);
  loadLoginFacebookConfig();

  React.useEffect(() => {
    verifLogin();
  }, []);

  const verifLogin = async () => {
    const data = await Auth.currentAuthenticatedUser();
    const token = data.signInUserSession.idToken.jwtToken;
    if (data.signInUserSession.idToken.payload.identities[0].providerName !== 'Facebook') {
      goTo(ROUTES.login);
    }
    const user = await loginWithCognitoToken(token);
    if (!user || !user?.data) {
      console.error('user not define');
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
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_512X512} height="200px" width="200px" />
      </div>
      <Paper className={styles.card}>
        <CardContent>
          <Typography>{t('wait_before_redirection')}</Typography>
        </CardContent>
      </Paper>
    </Container>
  );
}
