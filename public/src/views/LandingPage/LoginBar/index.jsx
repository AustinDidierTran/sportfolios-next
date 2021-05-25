import React from 'react';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../actions/goTo';

import styles from './LoginBar.module.css';

const LoginBar = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => {
          goTo(ROUTES.login);
        }}
      >
        {t('landingPage.goToPlatform')}
      </button>
    </div>
  );
};

export default LoginBar;
