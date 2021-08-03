import React, { useContext, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Paper from '../../../../components/Custom/Paper';
import List from '../../../../components/Custom/List';
import styles from './NewsLetterEmail.module.css';
import api from '../../../../actions/api';
import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { ACTION_ENUM, Store } from '../../../../Store';
import { SEVERITY_ENUM } from '../../../../../common/enums';

export default function NewsLetterEmail() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [email, setEmail] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchEmail = async () => {
    const { data } = await api('/api/user/emails', { method: 'GET' });
    setIsSubscribed(data[0].is_subscribed);
    setEmail(data[0]);
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  const handleUnsubscribe = async (subscription) => {
    const res = await api('/api/user/changeSubscription', {
      method: 'PUT',
      body: JSON.stringify({
        subscription,
        email: email.email,
      }),
    });

    if (res.status) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: subscription ? t('subscribed') : t('unsubscribed'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
      fetchEmail();
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  return (
    <Paper className={styles.card}>
      <List title={t('newsletter')} />
      <CardContent style={{ paddingTop: '0px' }}>
        <div className={styles.subscribe}>
          <Checkbox
            className={styles.checkbox}
            checked={isSubscribed}
            color="default"
            onChange={() => {
              handleUnsubscribe(!isSubscribed);
            }}
          />
          <label>
            <Typography color="textSecondary">
              {isSubscribed
                ? t('newsletter_email_subscribed', { email: email.email })
                : t('newsletter_email_unsubscribed', { email: email.email })}
            </Typography>
          </label>
        </div>
      </CardContent>
    </Paper>
  );
}
