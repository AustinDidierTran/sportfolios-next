import { Store, StoreProvider } from '../public/src/Store';
import '../styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../public/theme';
import i18n from '../public/src/i18n';
import styles from './App.module.css';
import Header from '../public/src/views/Header';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';
import { Helmet } from 'react-helmet';

import conf from '../conf';

import loadable from '@loadable/component';

const BottomNavigation = loadable(() => import('../public/src/components/Custom/BottomNavigation'));
const SnackBar = loadable(() => import('../public/src/components/Custom/SnackBar'));
const SpeedDial = loadable(() => import('../public/src/components/Custom/SpeedDial'));

const stripePromise = loadStripe(conf.STRIPE.publicKey);

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (!('serviceWorker' in navigator)) {
        console.warn('Pwa support is disabled');
        return;
      }

      const wb = new Workbox('/sw.js', { scope: '/' });
      wb.register();
    }
  }, []);

  return (
    <StoreProvider>
      <Helmet>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="src/images/apple-touch-icon-180x180.png" />
      </Helmet>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <Elements stripe={stripePromise}>
            <div className={styles.app}>
              <div className={styles.header}>
                <Header />
              </div>
              <div className={styles.main}>
                <Component {...pageProps} />
              </div>
              <SpeedDial />
              <SnackBar />
              <BottomNavigation />
            </div>
          </Elements>
        </ThemeProvider>
      </I18nextProvider>
    </StoreProvider>
  );
}

export default MyApp;
