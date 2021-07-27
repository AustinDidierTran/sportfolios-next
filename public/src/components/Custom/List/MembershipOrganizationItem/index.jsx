import React, { useState, useMemo, useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { formatPrice, formatRoute } from '../../../../utils/stringFormats';
import styles from './MembershipOrganizationItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import CustomButton from '../../Button';
import AlertDialog from '../../Dialog/AlertDialog';
import dynamic from 'next/dynamic';
import { FORM_DIALOG_TYPE_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';
import api from '../../../../actions/api';

const CustomFormDialog = dynamic(() => import('../../FormDialog'));

export default function MembershipOrganizationItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    membership,
    price,
    membershipTypeText,
    expirationDate,
    update,
    id,
    taxRates,
    transactionFees,
    description,
    fileName,
    fileUrl,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [editTermsAndConditions, setEditTermsAndConditions] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const total = useMemo(
    () =>
      taxRates.reduce((prev, curr) => {
        return prev + (price * curr.percentage) / 100;
      }, 0) + price,
    [price, taxRates]
  );

  const onCloseEditTermsAndConditions = () => {
    setEditTermsAndConditions(false);
  };

  const onEdit = () => {
    setEditTermsAndConditions(true);
  };

  const onDelete = () => {
    setAlertDialog(true);
  };

  const closeAlertDialog = () => {
    setAlertDialog(false);
  };

  const deleteConfirmed = async () => {
    closeAlertDialog();
    await api(
      formatRoute('/api/entity/membership', null, {
        membershipId: id,
      }),
      {
        method: 'DELETE',
      }
    );
    update();
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t('member.membership_deleted'),
      severity: SEVERITY_ENUM.SUCCESS,
    });
  };

  return (
    <>
      <ListItem onClick={handleExpand}>
        <ListItemText primary={`${membership} | ${formatPrice(price)}`} secondary={membershipTypeText} />
        <CustomIconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </ListItem>
      <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ backgroundColor: '#F5F5F5' }}>
          <ListItem>
            <ListItemText primary={membershipTypeText} secondary={`${t('expire_on')} ${expirationDate}`} />
          </ListItem>
          {fileUrl != null && (
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('terms_and_conditions')}:`} />
              <a style={{ color: 'blue' }} href={`${fileUrl}`} target="_blank">{`${fileName}`}</a>
            </ListItem>
          )}
          {description != null && (
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('description.description')}:`} />
              <ListItemText style={{ 'white-space': 'pre-wrap' }} primary={`${description}`} />
            </ListItem>
          )}
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('subtotal')}:`} />
            <ListItemText primary={formatPrice(price)} />
          </ListItem>
          {taxRates.map((t, index) => (
            <ListItem className={styles.money} key={index}>
              <ListItemText primary={`${t.display_name} (${t.percentage}%)`} secondary={t.description} />
              <ListItemText primary={formatPrice((price * t.percentage) / 100)} />
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText primary={formatPrice(total)} />
          </ListItem>
          <Divider />
          {total != 0 && (
            <>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.transaction_fees')} />
                <ListItemText primary={formatPrice(transactionFees)} />
              </ListItem>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.received_amount')} />
                <ListItemText primary={formatPrice(total - transactionFees)} />
              </ListItem>
              <Divider />
            </>
          )}
          <CustomButton
            onClick={() => {
              onDelete();
            }}
            endIcon="Delete"
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete.delete')}
          </CustomButton>

          <CustomButton
            onClick={() => {
              onEdit();
            }}
            endIcon="Edit"
            color="primary"
            style={{ margin: '8px' }}
          >
            {t('edit.edit_terms_and_conditions')}
          </CustomButton>

          <AlertDialog
            open={alertDialog}
            onSubmit={deleteConfirmed}
            onCancel={closeAlertDialog}
            description={t('delete.delete_membership_confirmation')}
            title={t('delete.delete_membership')}
          />

          <CustomFormDialog
            type={FORM_DIALOG_TYPE_ENUM.EDIT_MEMBERSHIP_TERMS_AND_CONDITIONS}
            items={{
              open: editTermsAndConditions,
              onClose: onCloseEditTermsAndConditions,
              update,
              id,
              fileName,
              fileUrl,
              description,
            }}
          />
        </div>
      </CustomCollapse>
      <Divider />
    </>
  );
}
