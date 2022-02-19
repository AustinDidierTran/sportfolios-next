import React from 'react';
import { useTranslation } from 'react-i18next';

import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';

import { Auth } from 'aws-amplify';
import '../../../../utils/amplify/amplifyConfig.jsx';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { loginWithCognitoToken } from '../../../../actions/service/auth/auth';
import { ACTION_ENUM, Store } from '../../../../Store';
import { loadLoginGoogleConfig } from '../../../../utils/amplify/amplifyConfig.jsx';
import Container from '../components/Container';
import Content from '../components/Content';
import { DescriptionText } from '../components';

export default function googleLogin() {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(Store);
  loadLoginGoogleConfig();

  React.useEffect(() => {
    verifLogin();
  }, []);

  const verifLogin = async () => {
    const data = await Auth.currentAuthenticatedUser();
    const token = data.signInUserSession.idToken.jwtToken;
    if (data.signInUserSession.idToken.payload.identities[0].providerName !== 'Google') {
      goTo(ROUTES.login);
    }
    const user = await loginWithCognitoToken(token);
    if (!user || !user?.data) {
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
    <Container>
      <Content>
        <SportfoliosLogo height={120} width={120} />
        <DescriptionText>{t('wait_before_redirection')}</DescriptionText>
      </Content>
    </Container>
  );
}
