import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SportfoliosPresentation.module.css';

const SportfoliosPresentation = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <img
          src="https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210524-yq4kb-8317ff33-3b04-49a1-afd3-420202cddf73"
          className={styles.img}
        />
        <h1 className={styles.title}>{t('landingPage.header.slogan')}</h1>
      </div>
    </div>
  );
};

export default SportfoliosPresentation;
