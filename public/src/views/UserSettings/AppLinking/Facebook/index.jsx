import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../../../../components/Custom/Container';
import Paper from '../../../../components/Custom/Paper';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import styles from './addFacebook.module.css';
import { Auth } from 'aws-amplify';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { validEmail } from '../../../../actions/service/auth/auth';
import { addEmail } from '../../../../actions/service/user';
import { ACTION_ENUM, Store } from '../../../../Store';
import { SEVERITY_ENUM, LOGO_ENUM } from '../../../../../common/enums';
import { loadAddEmailConfigFacebook } from '../../../../utils/amplify/amplifyConfig';

export default function googleLogin() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = React.useContext(Store);

  const verifyEmail = useCallback(async () => {
    const data = await Auth.currentAuthenticatedUser();
    if (!data?.signInUserSession?.idToken.payload.identities) {
      goTo(ROUTES.userSettings);
    }

    if (data?.signInUserSession.idToken?.payload?.identities[0].providerName !== 'Facebook') {
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
      goTo(ROUTES.userSettings);
      return;
    }

    const result = await addEmail(userInfo.userId, email, false);

    if (result.data !== 200) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 2000,
      });
      goTo(ROUTES.userSettings);
      return;
    }

    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('email_added'),
      severity: SEVERITY_ENUM.SUCCESS,
      duration: 2000,
    });
    goTo(ROUTES.userSettings);
  });

  React.useEffect(() => {
    if (userInfo.userId !== undefined) {
      loadAddEmailConfigFacebook();
      verifyEmail();
    }
  }, [userInfo]);

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
