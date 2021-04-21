import React from 'react';
import CheckCircle from '@material-ui/icons/CheckCircle';

import styles from './ConfirmedEmailField.module.css';
import TextField from '../../../../components/Custom/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';

export default function ConfirmedEmailField(props) {
  const { t } = useTranslation();
  const {
    email: { email, confirmed_email_at },
  } = props;
  return (
    <div className={styles.container}>
      <TextField disabled value={email} fullWidth />
      <span className={styles.confirmedIcon}>
        <Tooltip
          title={t('confirmed_on', {
            confirmedOn: confirmed_email_at,
          })}
        >
          <CheckCircle color="primary" size="small" />
        </Tooltip>
      </span>
    </div>
  );
}
