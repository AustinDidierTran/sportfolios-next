import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import styles from './AddParticipants.module.css';
import Add from '@material-ui/icons/Add';

export default function AddParticipants() {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <Add size="small" className={styles.add} />
      <Typography variant="body1" className={styles.writing}>
        {t('add.add_people')}
      </Typography>
    </div>
  );
}
