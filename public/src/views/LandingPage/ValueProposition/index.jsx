import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ValueProposition.module.css';

const ValueProposition = (props) => {
  const { t } = useTranslation();
  const valueProposition = ['performance', 'longevity', 'community'];

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>{t('landingPage.valueProposition.title')}</h1>
        {valueProposition.map((m) => (
          <div className={styles.moduleContainer}>
            <div className={styles.moduleTitle}>{t(`landingPage.valueProposition.${m}.title`)}</div>
            <div className={styles.moduleDescription}>{t(`landingPage.valueProposition.${m}.description`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueProposition;
