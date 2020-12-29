import { StoreProvider } from "../public/src/Store";
import "../styles/globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../public/src/i18n";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </StoreProvider>
  );
}

export default MyApp;
