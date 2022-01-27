import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import styles from './Login.module.css';
import FacebookLogo from '../../../images/svg/logo/facebook.svg';
import GoogleLogo from '../../../images/svg/logo/google.svg';
import SportfoliosLogo from '../../../images/svg/logo/sportfolios_teal.svg';

import AccountCircle from '@material-ui/icons/AccountCircle';

import { useRouter } from 'next/router';
import { Store } from '../../Store';
import { ROUTES } from '../../actions/goTo';

import { Auth } from 'aws-amplify';
import { loadLoginGoogleConfig, loadLoginFacebookConfig } from '../../utils/amplify/amplifyConfig.jsx';
import LoginFooter from './components/Footer/Footer';
import { useRedirectUrl } from '../../hooks/url';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const {
    state: { isAuthenticated },
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = redirectUrl || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  loadLoginGoogleConfig();
  const loginGoogle = async () => {
    Auth.federatedSignIn({ provider: 'Google' });
  };

  loadLoginFacebookConfig();
  const loginFacebook = async () => {
    Auth.federatedSignIn({ provider: 'Facebook' });
  };

  const loginEmailRoute = useRedirectUrl(ROUTES.login, redirectUrl);

  const signupRoute = useRedirectUrl(ROUTES.signup, redirectUrl);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SportfoliosLogo height={120} width={120} />
        <h3>{t('login.login_to_sportfolios')}</h3>
        <Link href={loginEmailRoute}>
          <div className={styles.loginCard}>
            <span className={styles.cardIcon}>
              <AccountCircle />
            </span>
            {t('login.login_with_email')}
          </div>
        </Link>
        <div className={styles.loginCard} onClick={loginGoogle}>
          <span className={styles.cardIcon}>
            <GoogleLogo height={24} width={24} />
          </span>
          {t('login.login_with_google')}
        </div>
        <div className={styles.loginCard} onClick={loginFacebook}>
          <span className={styles.cardIcon}>
            <FacebookLogo height={24} width={24} />
          </span>
          {t('login.login_with_facebook')}
        </div>
        <p>
          {t('login.no_account')} <Link href={signupRoute}>{t('login.signup')}</Link>
        </p>
      </div>
      <LoginFooter />
    </div>
  );
}
