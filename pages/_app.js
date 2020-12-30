import { Store, StoreProvider } from "../public/src/Store";
import "../styles/globals.css";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../public/theme";
import i18n from "../public/src/i18n";
import styles from "./App.module.css";
import Header from "../public/src/views/Header";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import conf from "../conf";
import {
  BottomNavigation,
  SnackBar,
  SpeedDial,
} from "../public/src/components/Custom";
const stripePromise = loadStripe(conf.STRIPE.publicKey);

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
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
