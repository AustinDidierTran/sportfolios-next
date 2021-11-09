import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import styles from './RemoveParticipants.module.css';
import Delete from '@material-ui/icons/Delete';

export default function RemoveParticipants(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <Delete size="small" className={styles.remove} />
      <Typography variant="body1" className={styles.writing}>
        {t('delete.delete_participants')}
      </Typography>
    </div>
  );
}
