import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import styles from './ChangeName.module.css';
import CreateIcon from '@material-ui/icons/Create';

export default function ChangeName() {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <CreateIcon size="small" className={styles.create} />
      <Typography variant="body1" className={styles.writing}>
        {t('change_conversation_name')}
      </Typography>
    </div>
  );
}
