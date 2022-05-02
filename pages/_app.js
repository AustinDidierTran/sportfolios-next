import React, { useEffect, useMemo } from 'react';

import { StoreProvider } from '../public/src/Store';
import '../styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import theme from '../public/theme';
import muiTheme from '../public/mui-theme';
import i18n from '../public/src/i18n';
import styles from './App.module.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Workbox } from 'workbox-window';
import { Helmet } from 'react-helmet';
import Header from '../public/src/views/Header';
import conf from '../conf';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AddGaPageView, InitGa } from '../public/src/components/Custom/Analytics';
import { ROUTES } from '../public/src/actions/goTo';
import { MuiThemeProvider } from '@material-ui/core';

const BottomNavigation = dynamic(() => import('../public/src/components/Custom/BottomNavigation'));
const SnackBar = dynamic(() => import('../public/src/components/Custom/SnackBar'));
const stripePromise = loadStripe(conf.STRIPE.publicKey);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (!('serviceWorker' in navigator)) {
        // eslint-disable-next-line no-console
        console.warn('Pwa support is disabled');
        return;
      }

      const wb = new Workbox('/sw.js', { scope: '/' });
      wb.register();
    }
  }, []);

  useEffect(() => {
    InitGa();
    AddGaPageView();
  });

  const hasHeader = useMemo(
    () =>
      ![
        ROUTES.forgotPassword,
        ROUTES.landingPage,
        ROUTES.login,
        ROUTES.loginEmail,
        ROUTES.loginFacebook,
        ROUTES.loginGoogle,
        ROUTES.menu,
        ROUTES.notifications,
        ROUTES.recoveryEmail,
        ROUTES.setupPrimaryPerson,
        ROUTES.signup,
        ROUTES.signupEmail,
        ROUTES.signupEmailValidate,
        ROUTES.signupFacebook,
        ROUTES.signupGoogle,
      ].includes(router.pathname) && ![ROUTES.cart].some((r) => router.pathname.indexOf(r) !== -1),
    [router.pathname]
  );

  return (
    <StoreProvider>
      <link rel="manifest" href="/manifest.webmanifest" />
      <Helmet>
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="src/images/icon-180x180.png" />
      </Helmet>
      <I18nextProvider i18n={i18n}>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={theme}>
            <Elements stripe={stripePromise}>
              <div className={styles.app}>
                {hasHeader ? (
                  <div className={styles.header}>
                    <Header />
                  </div>
                ) : null}
                <div className={styles.main}>
                  <Component {...pageProps} />
                </div>
                <SnackBar />
                {hasHeader ? <BottomNavigation /> : null}
              </div>
            </Elements>
          </ThemeProvider>
        </MuiThemeProvider>
      </I18nextProvider>
    </StoreProvider>
  );
}

export default MyApp;
