import React from 'react';
import CustomCheckBox from '../../../CheckBox';
import CustomAvatar from '../../../Avatar';
import CustomIconButton from '../../../IconButton';
import AlertDialog from '../../../Dialog/AlertDialog';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../CartItem.module.css';
import { useTranslation } from 'react-i18next';
import { IMAGE_ENUM } from '../../../../../../common/enums';
import { formatPrice } from '../../../../../utils/stringFormats';

export default function DonationItem(props) {
  const {
    organization,
    person,
    taxLength,
    note,
    amount,
    label,
    onDelete,
    onClick,
    handleChange,
    disabled,
    checked,
    open,
    setOpen,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <CustomAvatar
              photoUrl={organization?.photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
              variant="square"
              className={styles.photo}
            />
          </ListItemIcon>
          <ListItemText className={styles.name} primary={t(label)} secondary={organization?.name} />
          <ListItemText
            className={styles.quantity}
            primary={taxLength ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
            secondary={`${person?.name} ${person?.surname || ''}`}
          />
          <Tooltip title={checked ? t('payment.remove_from_current_invoice') : t('payment.add_to_current_invoice')}>
            <div>
              <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} style={{ margin: '0px' }} />
            </div>
          </Tooltip>
          <CustomIconButton
            variant="contained"
            onClick={onClick}
            icon="Delete"
            tooltip={t('delete.delete')}
            style={{ color: 'primary' }}
          />
        </div>
      </ListItem>
      {note ? (
        <ListItem style={{ width: '100%' }}>
          <div style={{ textAlign: 'left' }}>
            {t('donation_note')}:<ListItemText style={{ textAlign: 'left' }} secondary={note} />
          </div>
        </ListItem>
      ) : null}
      <Divider />
      <AlertDialog
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        title={t('delete.delete_cart_item_confirmation')}
        onSubmit={onDelete}
      />
    </>
  );
}
