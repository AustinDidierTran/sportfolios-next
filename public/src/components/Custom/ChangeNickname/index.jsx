import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import styles from './ChangeNickname.module.css';
import FaceIcon from '@material-ui/icons/Face';

export default function ChangeNickname(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.item}>
      <FaceIcon size="small" className={styles.face} />
      <Typography variant="body1" className={styles.writing}>
        {t('change_nicknames')}
      </Typography>
    </div>
  );
}
