import React, { useState } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';

import CustomIcon from '../../Icon';
import CustomIconButton from '../../IconButton';
import { useTranslation } from 'react-i18next';
import { formatDate, formatRoute } from '../../../../utils/stringFormats';
import moment from 'moment';
import api from '../../../../actions/api';
import AlertDialog from '../../Dialog/AlertDialog';
import { COLORS } from '../../../../utils/colors';

export default function BankAccountItem(props) {
  const { t } = useTranslation();
  const { last4, createdAt, isDefault, bankAccountId, update, removeDelete } = props;
  const [openDelete, setOpenDelete] = useState(false);

  const onChange = async () => {
    await api('/api/stripe/defaultBankAccount', {
      method: 'PUT',
      body: JSON.stringify({
        bankAccountId,
      }),
    });
    update();
  };

  const onDelete = async () => {
    await api(
      formatRoute('/api/stripe/bankAccount', null, {
        bankAccountId,
      }),
      {
        method: 'DELETE',
      }
    );
    update();
  };

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemIcon>
          <CustomIcon icon="AccountBalance" />
        </ListItemIcon>
        <ListItemText
          primary={`**** **** **** ${last4}`}
          secondary={`${t('create.created_on')} ${formatDate(moment.utc(createdAt))}`}
        />
        <ListItemText secondary={t('default')} style={{ textAlign: 'end', margin: '4px' }} />
        <Radio checked={isDefault} label={t('default')} color="primary" onClick={onChange} />
        {removeDelete ? null : (
          <CustomIconButton
            icon="Delete"
            onClick={() => {
              setOpenDelete(true);
            }}
            style={{ color: COLORS.grey }}
            tooltip={t('remove')}
          />
        )}
      </ListItem>
      <AlertDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onSubmit={onDelete}
        title={t('remove_bank_account_confirmation', { last4 })}
      />
    </>
  );
}
