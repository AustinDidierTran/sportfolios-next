import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../../../components/Custom/Container';
import Paper from '../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import styles from './SignupFacebook.module.css';
import { Auth } from 'aws-amplify';
import { goTo, ROUTES } from '../../../actions/goTo';
import { addEmail } from '../../../actions/service/user';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM, LOGO_ENUM } from '../../../../common/enums';
import { loadSignupFacebookConfig } from '../../../utils/amplify/amplifyConfig.jsx';
import { signupFacebookToken, validEmail } from '../../../actions/service/auth/auth';

export default function facebookSignup() {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(Store);

  loadSignupFacebookConfig();

  React.useEffect(() => {
    signupGmail();
  }, [dispatch]);

  const signupGmail = async () => {
    const data = await Auth.currentAuthenticatedUser();
    console.log(data);
    if (!data.signInUserSession.idToken.payload.identities) {
      goTo(ROUTES.signup);
    }

    if (data?.signInUserSession?.idToken?.payload?.identities[0].providerName !== 'Facebook') {
      goTo(ROUTES.userSettings);
    }
    const email = data.signInUserSession.idToken.payload.email;
    const emailValid = await validEmail(email);
    if (!emailValid) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('email_already_exist'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 2000,
      });
      goTo(ROUTES.signup);
      return;
    }

    const token = data.signInUserSession.idToken.jwtToken;
    await signupFacebookToken(token);
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('signup_done'),
      severity: SEVERITY_ENUM.SUCCESS,
      duration: 2000,
    });

    goTo(ROUTES.login);
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
