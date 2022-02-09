import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import styles from '../Authentication.module.css';
import FacebookLogo from '../../../../images/svg/logo/facebook.svg';
import GoogleLogo from '../../../../images/svg/logo/google.svg';
import SportfoliosLogo from '../../../../images/svg/logo/sportfolios_teal.svg';

import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';

import AccountCircle from '@material-ui/icons/AccountCircle';

import { useRouter } from 'next/router';
import { Store } from '../../../Store';
import { ROUTES } from '../../../actions/goTo';

import { Auth } from 'aws-amplify';
import { loadLoginGoogleConfig, loadLoginFacebookConfig } from '../../../utils/amplify/amplifyConfig.jsx';
import LoginFooter from '../components/Footer/Footer';
import { useRedirectUrl } from '../../../hooks/url';

const Signup: React.FunctionComponent = () => {
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

  const signupEmailRoute = useRedirectUrl(ROUTES.signupEmail, redirectUrl as string);

  const loginRoute = useRedirectUrl(ROUTES.login, redirectUrl as string);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('auth.register_sportfolios')}</h3>
        <Link href={signupEmailRoute}>
          <div className={styles.loginCard}>
            <span className={styles.cardIcon}>
              <AccountCircle />
            </span>
            {t('auth.signup_with_email')}
          </div>
        </Link>
        <div className={styles.loginCard} onClick={loginGoogle}>
          <span className={styles.cardIcon}>
            <GoogleLogo height={24} width={24} />
          </span>
          {t('auth.login_with_google')}
        </div>
        <div className={styles.loginCard} onClick={loginFacebook}>
          <span className={styles.cardIcon}>
            <FacebookLogo height={24} width={24} />
          </span>
          {t('auth.login_with_facebook')}
        </div>
        <p>
          {t('auth.already_account')} <Link href={loginRoute}>{t('auth.login')}</Link>
        </p>
      </div>
      <LoginFooter />
    </div>
  );
};

export default Signup;
