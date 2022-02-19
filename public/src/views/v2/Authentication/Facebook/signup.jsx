import React from 'react';
import { useTranslation } from 'react-i18next';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';

import { Auth } from 'aws-amplify';
import { goTo, ROUTES } from '../../../../actions/goTo';

import { ACTION_ENUM, Store } from '../../../../Store';
import { SEVERITY_ENUM } from '../../../../../common/enums';
import { loadSignupFacebookConfig } from '../../../../utils/amplify/amplifyConfig.jsx';
import { signupFacebookToken, validEmail } from '../../../../actions/service/auth/auth';
import Container from '../components/Container';
import Content from '../components/Content';
import { DescriptionText } from '../components';

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
    <Container>
      <Content>
        <SportfoliosLogo height={120} width={120} />
        <DescriptionText>{t('wait_before_redirection')}</DescriptionText>
      </Content>
    </Container>
  );
}
