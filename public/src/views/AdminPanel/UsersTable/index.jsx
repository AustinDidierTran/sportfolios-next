import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Paper } from '../../../components/Custom';
import CardContent from '@material-ui/core/CardContent';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import Router from 'next/router';
export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);

  const updateUsers = async () => {
    const res = await api('/api/admin/users');

    const tempUser = res.data.map((user) => ({
      ...user,
      emails: user.emails.join(', '),
    }));
    setUsers(tempUser);
    setInitialUsers(tempUser);
  };

  const headers = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
    { display: t('app_role'), value: 'role', width: '10%' },
  ];

  const filterArray = ['name', 'emails', 'surname'];

  const handleFilter = (event) => {
    if (!event.target.value) {
      setUsers(initialUsers);
    } else {
      const userTemp = initialUsers.map((obj) => {
        const objUser = { ...obj };
        objUser.secondAccount = objUser.secondAccount.filter((o) => {
          return JSON.stringify(Object.values(JSON.parse(JSON.stringify(o, filterArray))))
            .toLowerCase()
            .includes(event.target.value.toLowerCase());
        });
        return objUser;
      });

      setUsers(
        userTemp.filter((o) => {
          return (
            JSON.stringify(Object.values(JSON.parse(JSON.stringify(o, filterArray))))
              .toLowerCase()
              .includes(event.target.value.toLowerCase()) ||
            JSON.stringify(Object.values(JSON.parse(JSON.stringify(o.secondAccount, filterArray))))
              .toLowerCase()
              .includes(event.target.value.toLowerCase())
          );
        })
      );
    }
  };

  useEffect(() => {
    updateUsers();
  }, []);

  return (
    <Paper className={styles.card}>
      <CardContent className={styles.inputs}>
        <Table
          filter={true}
          filterhandler={handleFilter}
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
