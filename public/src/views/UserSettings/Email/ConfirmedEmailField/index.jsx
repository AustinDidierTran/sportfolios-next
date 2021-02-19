import React from 'react';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Delete from '@material-ui/icons/Delete';

import styles from './ConfirmedEmailField.module.css';
import { TextField } from '../../../../components/Custom';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';

export default function ConfirmedEmailField(props) {
  const { t } = useTranslation();
  const {
    email: { email, confirmed_email_at },
    isDeletable,
  } = props;
  return (
    <div className={styles.container}>
      <TextField disabled value={email} fullWidth className={styles.TextField} />
      <span className={styles.confirmedIcon}>
        <Tooltip
          title={t('confirmed_on', {
            confirmedOn: confirmed_email_at,
          })}
        >
          <CheckCircle color="primary" size="small" />
        </Tooltip>
      </span>
      {isDeletable ? (
        <span className={styles.deleteIcon}>
          <Tooltip title={t('delete.delete_this_email_from_your_account')}>
            <IconButton size="small">
              <Delete size="small" />
            </IconButton>
          </Tooltip>
        </span>
      ) : (
        <></>
      )}
    </div>
  );
}
