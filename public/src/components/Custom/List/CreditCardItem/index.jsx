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

export default function CreditCardItem(props) {
  const { t } = useTranslation();
  const { last4, createdAt, isDefault, customerId, update } = props;
  const [openDelete, setOpenDelete] = useState(false);

  const onChange = async () => {
    await api('/api/stripe/defaultCreditCard', {
      method: 'PUT',
      body: JSON.stringify({
        customerId,
      }),
    });
    update();
  };

  const onDelete = async () => {
    await api(formatRoute('/api/stripe/creditCard', null, { customerId }), {
      method: 'DELETE',
    });
    update();
  };

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemIcon>
          <CustomIcon icon="CreditCard" />
        </ListItemIcon>
        <ListItemText
          primary={`**** **** **** ${last4}`}
          secondary={`${t('create.created_on')} ${formatDate(moment.utc(createdAt))}`}
        />
        <ListItemText secondary={t('default')} style={{ textAlign: 'end', margin: '4px' }} />
        <Radio checked={isDefault} label={t('default')} color="primary" onClick={onChange} />
        <CustomIconButton
          icon="Delete"
          onClick={() => {
            setOpenDelete(true);
          }}
          style={{ color: 'grey' }}
          tooltip={t('delete.delete')}
        />
      </ListItem>
      <AlertDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onSubmit={onDelete}
        title={t('delete.delete_credit_card_confirmation', { last4 })}
      />
    </>
  );
}
