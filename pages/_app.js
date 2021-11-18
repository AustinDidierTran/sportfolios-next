import React, { useEffect } from 'react';

import { StoreProvider } from '../public/src/Store';
import '../styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../public/theme';
import i18n from '../public/src/i18n';
import styles from './App.module.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Workbox } from 'workbox-window';
import { Helmet } from 'react-helmet';
import Header from '../public/src/views/Header';
import { STRIPE_PUBLIC_KEY } from '../conf';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ROUTES_ENUM } from '../public/common/enums';
import { AddGaPageView, InitGa } from '../public/src/components/Custom/Analytics';

const BottomNavigation = dynamic(() => import('../public/src/components/Custom/BottomNavigation'));
const SnackBar = dynamic(() => import('../public/src/components/Custom/SnackBar'));
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

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

  return (
    <StoreProvider>
      <link rel="manifest" href="/manifest.webmanifest" />
      <Helmet>
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="src/images/icon-180x180.png" />
      </Helmet>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <Elements stripe={stripePromise}>
            <div className={styles.app}>
              {router.pathname !== ROUTES_ENUM.landingPage ? (
                <div className={styles.header}>
                  <Header />
                </div>
              ) : null}
              <div className={styles.main}>
                <Component {...pageProps} />
              </div>
              <SnackBar />
              {router.pathname !== ROUTES_ENUM.landingPage ? <BottomNavigation /> : null}
            </div>
          </Elements>
        </ThemeProvider>
      </I18nextProvider>
    </StoreProvider>
  );
}

export default MyApp;
