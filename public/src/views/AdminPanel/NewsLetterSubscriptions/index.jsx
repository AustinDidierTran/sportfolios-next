import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import Table from '../../../components/Custom/Table';
import CardContent from '@material-ui/core/CardContent';
import styles from './NewsLetterSubscriptions.module.css';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';
export default function NewsLetterSubscriptions() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { dispatch } = useContext(Store);

  const getNewsLetterEmails = async () => {
    const res = await api('/api/admin/newsLetterSubscriptions');

    const tempUser = res.data.map((user) => ({
      ...user,
      emails: user.emails.join(', '),
      secondAccount: user.secondAccount.map((account) => ({
        ...account,
      })),
    }));
    setUsers(tempUser);
  };

  const copyToClipBoard = () => {
    const allEmails = users.map((u) => u.emails.toString()).join(', ');
    //this could not be supported in every browser
    navigator.clipboard.writeText(allEmails);
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('copied_emails'),
      severity: SEVERITY_ENUM.INFO,
      duration: 4000,
    });
  };

  const headers = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
  ];

  const secondHeaders = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
  ];

  useEffect(() => {
    getNewsLetterEmails();
  }, []);

  return (
    <Paper>
      <CardContent>
        <div className={styles.container}>
          <Button className={styles.button} onClick={copyToClipBoard}>
            {t('copy_emails')}
          </Button>
        </div>
        <Table
          filter
          data={users}
          headers={headers}
          secondHeaders={secondHeaders}
          title={t('newsletter_inscription')}
        />
      </CardContent>
    </Paper>
  );
}
