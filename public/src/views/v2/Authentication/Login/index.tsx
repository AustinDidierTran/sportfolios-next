import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import FacebookLogo from '../../../../../images/svg/logo/facebook.svg';
import GoogleLogo from '../../../../../images/svg/logo/google.svg';
import SportfoliosLogo from '../../../../../images/svg/logo/sportfolios_teal.svg';

import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';

import AccountCircle from '@material-ui/icons/AccountCircle';

import { useRouter } from 'next/router';
import { Store } from '../../../../Store';
import { goTo, ROUTES } from '../../../../actions/goTo';

import { Auth } from 'aws-amplify';
import { loadLoginGoogleConfig, loadLoginFacebookConfig } from '../../../../utils/amplify/amplifyConfig.jsx';
import LoginFooter from '../components/Footer';
import { useRedirectUrl } from '../../../../hooks/url';
import Container from '../components/Container';
import Content from '../components/Content';
import LoginCard from '../components/LoginCard';

const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const {
    state: { isAuthenticated },
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = (redirectUrl as string) || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  loadLoginGoogleConfig();
  const loginGoogle = async () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  loadLoginFacebookConfig();
  const loginFacebook = async () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook });
  };

  const loginEmailRoute = useRedirectUrl(ROUTES.loginEmail, redirectUrl as string);

  const signupRoute = useRedirectUrl(ROUTES.signup, redirectUrl as string);

  return (
    <Container>
      <Content>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('auth.login_to_sportfolios')}</h3>
        <LoginCard label={t('auth.login_with_email')} onClick={() => goTo(loginEmailRoute)}>
          <AccountCircle />
        </LoginCard>
        <LoginCard onClick={loginGoogle} label={t('auth.login_with_google')}>
          <GoogleLogo height={24} width={24} />
        </LoginCard>
        <LoginCard onClick={loginFacebook} label={t('auth.login_with_facebook')}>
          <FacebookLogo height={24} width={24} />
          {}
        </LoginCard>
        <p>
          {t('auth.no_account')} <Link href={signupRoute}>{t('auth.signup')}</Link>
        </p>
      </Content>
      <LoginFooter />
    </Container>
  );
};

export default Login;
