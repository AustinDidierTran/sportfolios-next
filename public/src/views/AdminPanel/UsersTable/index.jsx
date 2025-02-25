import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '../../../components/Custom/Table';
import Paper from '../../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import styles from './UsersTable.module.css';
import api from '../../../actions/api';
import Router from 'next/router';
import { formatRoute } from '../../../utils/stringFormats';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import Typography from '@material-ui/core/Typography';
import { getUsersAndSecond } from '../../../actions/service/entity/get';
import Button from '@material-ui/core/Button';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import TextField from '@material-ui/core/TextField';

export default function UsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [, setInitialUsers] = useState([]);
  const [numberToLoad] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [pageUserIndex, setPageUserIndex] = useState(1);

  const loadUsers = async (offset, filter) => {
    const fetchedUsers = await getUsersAndSecond(offset, filter);

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
    loadUsers(offsetUser, filter);
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

  const offsetUser = useMemo(() => (pageUserIndex - 1) * numberToLoad, [pageUserIndex, numberToLoad]);

  const handleChangePage = (value) => {
    const newPage = Math.max(1, value);
    setPageUserIndex(newPage);
  };

  useEffect(() => {
    setIsLoading(true);
    loadUsers(offsetUser, filter).then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadUsers(offsetUser, filter);
  }, [filter, offsetUser]);

  return (
    <Paper className={styles.card}>
      {isLoading ? (
        <LoadingSpinner isComponent />
      ) : (
        <>
          <CardContent className={styles.inputs}>
            <Table
              filter
              filterhandler={(e) => setFilter(e.target.value)}
              data={users}
              headers={headers}
              secondHeaders={secondHeaders}
              mode={'collapse'}
              onRowClick={(d) => () => Router.push(`/${d.entityId}`)}
              title={t('users_table_title')}
            />
          </CardContent>
          <div className={styles.pageIndex}>
            {pageUserIndex === 1 ? (
              <Button startIcon={<ArrowBackIosRoundedIcon />} disabled></Button>
            ) : (
              <Button
                startIcon={<ArrowBackIosRoundedIcon />}
                onClick={() => handleChangePage(pageUserIndex - 1)}
              ></Button>
            )}
            <Typography>{`${offsetUser + 1}-${offsetUser + numberToLoad}`}</Typography>
            {users.length === numberToLoad ? (
              <Button
                startIcon={<ArrowForwardIosRoundedIcon />}
                onClick={() => handleChangePage(pageUserIndex + 1)}
              ></Button>
            ) : (
              <Button startIcon={<ArrowForwardIosRoundedIcon />} disabled></Button>
            )}
            <TextField
              label="#"
              type="search"
              onChange={(e) => handleChangePage(e.target.value)}
              value={pageUserIndex}
            />
          </div>
        </>
      )}
    </Paper>
  );
}
