import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Pricing.module.css';

const Pricing = (props) => {
  const { t } = useTranslation();
  const modules = ['payAsYouGo', 'premium', 'volumeDiscount'];

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>{t('landingPage.pricing.title')}</h1>
        {modules.map((m) => (
          <div className={styles.moduleContainer}>
            <div className={styles.moduleTitle}>{t(`landingPage.pricing.${m}.title`)}</div>
            <div className={styles.moduleDescription}>{t(`landingPage.pricing.${m}.description`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
