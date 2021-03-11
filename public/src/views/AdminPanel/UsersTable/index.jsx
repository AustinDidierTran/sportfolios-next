import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Paper } from '../../../components/Custom';
import CardContent from '@material-ui/core/CardContent';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import history from '../../../stores/history';
import Router from 'next/router';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const updateUsers = async () => {
    const res = await api('/api/admin/users');

    setUsers(
      res.data.map((user) => ({
        ...user,
        emails: user.emails.join(', '),
      }))
    );
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const headers = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
    { display: t('app_role'), value: 'role', width: '10%' },
  ];

  return (
    <Paper className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          data={users}
          headers={headers}
          mode={'collapse'}
          onRowClick={(d) => () => Router.push(`/${d.entityId}`)}
          title={t('users_table_title')}
        />
      </CardContent>
    </Paper>
  );
}
