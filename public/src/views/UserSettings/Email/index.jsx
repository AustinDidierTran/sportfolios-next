import React, { useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Paper from '../../../components/Custom/Paper';
import List from '../../../components/Custom/List';
import styles from './Email.module.css';
import ConfirmedEmailField from './ConfirmedEmailField';
import partition from 'lodash/partition';
import api from '../../../actions/api';
import { useTranslation } from 'react-i18next';

export default function Email() {
  const { t } = useTranslation();
  const [emails, setEmails] = useState([]);

  const fetchAllEmails = async () => {
    const { data } = await api('/api/user/emails', { method: 'GET' });
    setEmails(data);
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const [confirmedEmails] = partition(emails, (email) => email.confirmed_email_at);

  return (
    <Paper className={styles.card}>
      <List title={t('my_email')} />
      <CardContent style={{ paddingTop: '0px' }}>
        {confirmedEmails.map((email, index) => (
          <ConfirmedEmailField email={email} key={index} />
        ))}
      </CardContent>
    </Paper>
  );
}
