import React, { useState } from 'react';

import loadable from '@loadable/component';
import { Divider, ListItem, ListItemText } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './MemberItem.module.css';
import moment from 'moment';
import { useRouter } from 'next/router';
import { formatDate, getMembershipName } from '../../../../utils/stringFormats';
import { FORM_DIALOG_TYPE_ENUM, INVOICE_STATUS_ENUM } from '../../../../../common/enums';
import AlertDialog from '../../../../components/Custom/Dialog/AlertDialog';
import api from '../../../../actions/api';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { formatRoute } from '../../../../../common/utils/stringFormat';

const CustomIcon = loadable(() => import('../../../../components/Custom/Icon'));
const CustomFormDialog = loadable(() => import('../../../../components/Custom/FormDialog'));
const CustomIconButton = loadable(() => import('../../../../components/Custom/IconButton'));

export default function MemberItem(props) {
  const { t } = useTranslation();

  const { person, memberType, expirationDate, update, status } = props;
  const router = useRouter();
  const { id: entityId } = router.query;
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onCancel = () => {
    setOpenDelete(false);
  };

  const onDelete = () => {
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    await api(
      formatRoute('/api/entity/member', null, {
        memberType,
        organizationId: entityId,
        personId: person.id,
      }),
      {
        method: 'DELETE',
      }
    );
    setOpenDelete(false);
    update();
  };

  return (
    <>
      <ListItem style={{ width: '100%' }} className={styles.listItem} button>
        <ListItemText
          className={styles.item1}
          primary={`${person?.name} ${person?.surname}`}
          onClick={() => {
            goTo(ROUTES.entity, { id: person.id });
          }}
        ></ListItemText>
        {moment(expirationDate) < moment() ? (
          <ListItemText
            secondaryTypographyProps={{ color: 'secondary' }}
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('expired_on')}
              ${formatDate(moment(expirationDate))}`}
            onClick={() => {
              goTo(ROUTES.entity, { id: person.id });
            }}
          ></ListItemText>
        ) : (
          <ListItemText
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('valid_until')}
              ${formatDate(moment(expirationDate))}`}
            onClick={() => {
              goTo(ROUTES.entity, { id: person.id });
            }}
          ></ListItemText>
        )}
        <CustomFormDialog
          type={FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP}
          items={{
            open,
            onClose,
            update,
            membership: memberType,
            person,
            expirationDate,
          }}
        />
        {status === INVOICE_STATUS_ENUM.PAID || status === INVOICE_STATUS_ENUM.FREE ? (
          <CustomIcon icon="AttachMoney" color="green" />
        ) : (
          <CustomIcon icon="MoneyOff" color="red" />
        )}
        <CustomIconButton
          className={styles.iconButton}
          variant="contained"
          icon="Edit"
          tooltip={t('edit')}
          onClick={onOpen}
          style={{ color: 'primary' }}
        />
        <CustomIconButton
          className={styles.iconButton}
          variant="contained"
          icon="Delete"
          tooltip={t('delete')}
          onClick={onDelete}
          style={{ color: 'primary' }}
        />
        <AlertDialog
          open={openDelete}
          onCancel={onCancel}
          onSubmit={confirmDelete}
          title={t('delete_member_confirmation')}
        />
      </ListItem>
      <Divider />
    </>
  );
}
