import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import api from '../../../actions/api';
import IconButton from '../../../components/Custom/IconButton';
import List from '../../../components/Custom/List';
import Button from '../../../components/Custom/Button';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function TransferedPeople() {
  const { t } = useTranslation();
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [width] = useWindowSize();

  const fetchTransferedPeople = async () => {
    const { data } = await api('/api/user/transferedPeople', { method: 'GET' });
    setPeople(data);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTransferedPeople();
  }, []);

  const closeDeclineDialog = () => {
    setDeclineDialog(false);
  };
  const closeApproveDialog = () => {
    setApproveDialog(false);
  };

  const confirmDecline = () => {
    closeDeclineDialog();
    fetchTransferedPeople();
  };

  const confirmApprove = () => {
    closeApproveDialog();
    fetchTransferedPeople();
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  const actions = () =>
    width > MOBILE_WIDTH
      ? [
          <Button
            key={0}
            endIcon="Delete"
            size="small"
            onClick={() => {
              setDeclineDialog(true);
            }}
            color="secondary"
            style={{ marginRight: 5 }}
          >
            {t('decline')}
          </Button>,
          <Button
            key={1}
            endIcon="Check"
            size="small"
            onClick={() => {
              setApproveDialog(true);
            }}
            color="primary"
          >
            {t('accept')}
          </Button>,
        ]
      : [
          <IconButton
            key={0}
            size="medium"
            onClick={() => {
              setDeclineDialog(true);
            }}
            style={{ color: 'secondary' }}
            icon="Delete"
          />,
          <IconButton
            key={1}
            size="medium"
            onClick={() => {
              setApproveDialog(true);
            }}
            style={{ color: 'secondary' }}
            icon="Check"
          />,
        ];

  const items = people.map((person) => ({
    ...person,
    photoUrl: person.photo_url,
    completeName: person.name + ' ' + person.surname,
    secondary: t('transfered_to_you'),
    secondaryActions: actions(person),
  }));

  return (
    <>
      <Card style={{ marginTop: 16 }}>
        <List title={t('awaiting_your_approval')} items={items} />
      </Card>
      <AlertDialog open={declineDialog} onSubmit={confirmDecline} onCancel={closeDeclineDialog} />
      <AlertDialog open={approveDialog} onSubmit={confirmApprove} onCancel={closeApproveDialog} />
    </>
  );
}
