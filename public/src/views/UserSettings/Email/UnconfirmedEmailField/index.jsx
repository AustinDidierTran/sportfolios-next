import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Error from '@material-ui/icons/Error';

import styles from './UnconfirmedEmailField.module.css';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';

export default function UnconfirmedEmailField(props) {
  const { t } = useTranslation();
  const {
    email: { email },
  } = props;

  return (
    <div className={styles.container}>
      <TextField disabled value={email} fullWidth className={styles.TextField} />
      <span className={styles.unconfirmedIcon}>
        <Tooltip title={t('unconfirmed_email')}>
          <IconButton color="secondary" size="small">
            <Error color="secondary" />
          </IconButton>
        </Tooltip>
      </span>
      <span className={styles.deleteIcon}>
        <Tooltip title={t('delete.delete_this_email_from_your_account')}>
          <IconButton size="small">
            <Delete size="small" />
          </IconButton>
        </Tooltip>
      </span>
    </div>
  );
}
