import React from 'react';
import Link from 'next/link';

import styles from '../../Login.module.css';
import { useTranslation } from 'react-i18next';

const LoginFooter = () => {
  const { t } = useTranslation();
  const privacyPolicy = 'https://sportfolios-images.s3.amazonaws.com/production/privacy-policy/privacy-policy.html';
  const termsConditions = 'https://www.termsconditionstemplate.net/live.php?token=BCbkqtde4eVFO4unde1jCE7Wq6xucBzV';

  return (
    <div className={styles.footer}>
      {t('login.footer.by_continuing')}{' '}
      <Link href={termsConditions}>
        <b>{t('login.footer.terms_and_conditions')}</b>
      </Link>{' '}
      {t('login.footer.sportfolios_confirm')}{' '}
      <Link href={privacyPolicy}>
        <b>{t('login.footer.privacy_policy')}</b>
      </Link>{' '}
      {t('login.footer.of_sportfolios')}
    </div>
  );
};

export default LoginFooter;
