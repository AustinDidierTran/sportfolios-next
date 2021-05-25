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

export default function PersonItem(props) {
  const {
    photoUrl,
    description,
    metadata,
    personName,
    taxLength,
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
              photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
              variant="square"
              className={styles.photo}
            ></CustomAvatar>
          </ListItemIcon>
          <ListItemText className={styles.name} primary={description} secondary={personName} />
          <ListItemText
            className={styles.quantity}
            primary={
              metadata?.isIndividualOption
                ? taxLength
                  ? `${formatPrice(amount)} + ${t('taxes')} | ${metadata?.name}`
                  : `${formatPrice(amount)}| ${metadata?.name}`
                : taxLength
                ? `${formatPrice(amount)} + ${t('taxes')}`
                : `${formatPrice(amount)}`
            }
            secondary={label}
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
          ></CustomIconButton>
        </div>
      </ListItem>
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
