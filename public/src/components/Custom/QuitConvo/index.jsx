import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './QuitConvo.module.css';
import { Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function QuitConvo() {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <ExitToAppIcon size="small" className={styles.exit} />
      <Typography className={styles.writing} variant="body1">
        {t('quit_conversation')}
      </Typography>
    </div>
  );
}
