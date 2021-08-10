import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '../../../components/Custom/Table';
import Paper from '../../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import Router from 'next/router';
import { formatRoute } from '../../../utils/stringFormats';
import CustomButton from '../../../components/Custom/Button';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Typography from '@material-ui/core/Typography';
import { getAllUsers } from '../../../actions/service/entity/get';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);
  const [numberToLoad, setNumberToLoad] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async (number) => {
    setIsLoading(true);
    const fetchedUsers = await getAllUsers(number);

    const tempUser = fetchedUsers.map((user) => ({
      ...user,
      emails: user.emails.join(', '),
      secondAccount: user.secondAccount.map((account) => ({
        ...account,
        onIconButtonClick: () => {
          deleteSecondPerson(account.entity_id);
        },
        icon: 'Delete',
      })),
    }));
    setUsers(tempUser);
    setInitialUsers(tempUser);
    setIsLoading(false);
  };

  const deleteSecondPerson = async (entityId) => {
    await api(
      formatRoute('/api/admin/entities', null, {
        entityId: entityId,
      }),
      {
        method: 'DELETE',
      }
    );
    loadUsers(numberToLoad);
  };

  const headers = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
    { display: t('app_role'), value: 'role', type: 'adminButton', width: '10%' },
  ];

  const secondHeaders = [
    { display: '', value: 'collapse', width: '5%' },
    { display: '', value: 'photoUrl', type: 'avatar', width: '10%' },
    { display: t('name'), value: 'name', width: '20%' },
    { display: t('surname'), value: 'surname', width: '20%' },
    { display: t('email.emails'), value: 'emails', width: '35%' },
    { display: t('delete.delete'), value: 'role', type: 'iconButton', width: '10%' },
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
    loadUsers(50);
  }, []);

  useEffect(() => {
    loadUsers(numberToLoad);
  }, [numberToLoad]);

  return (
    <Paper className={styles.card}>
      {isLoading ? (
        <LoadingSpinner isComponent />
      ) : (
        <>
          <CardContent className={styles.inputs}>
            <Table
              filter
              filterhandler={handleFilter}
              data={users}
              headers={headers}
              secondHeaders={secondHeaders}
              mode={'collapse'}
              onRowClick={(d) => () => Router.push(`/${d.entityId}`)}
              title={t('users_table_title')}
            />
          </CardContent>
          <div className={styles.buttonContainer}>
            {users.length === numberToLoad ? (
              <CustomButton onClick={() => setNumberToLoad(numberToLoad + 50)}>{t('load_more')}</CustomButton>
            ) : (
              <Typography>{t('all_users_are_displayed')}</Typography>
            )}
          </div>
        </>
      )}
    </Paper>
  );
}
