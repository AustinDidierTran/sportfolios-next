import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Modules.module.css';

const Modules = () => {
  const { t } = useTranslation();
  const modules = ['clubs', 'teams', 'reporting'];

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>{t('landingPage.modules.title')}</h1>
        {modules.map((m, index) => (
          <div key={index} className={styles.moduleContainer}>
            <div className={styles.moduleTitle}>{t(`landingPage.modules.${m}.title`)}</div>
            <div className={styles.moduleDescription}>{t(`landingPage.modules.${m}.description`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
