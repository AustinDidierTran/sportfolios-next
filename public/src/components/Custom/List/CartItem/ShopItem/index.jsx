import React from 'react';
import CustomCheckBox from '../../../CheckBox';
import CustomAvatar from '../../../Avatar';
import CustomSelect from '../../../Select';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../CartItem.module.css';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../../utils/stringFormats';

export default function ShopItem(props) {
  const {
    photoUrl,
    size,
    taxLength,
    quantity,
    quantityOptions,
    updateQuantity,
    amount,
    label,
    handleChange,
    disabled,
    checked,
    id,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <CustomAvatar photoUrl={photoUrl} variant="square" className={styles.photo} />
          </ListItemIcon>
          <ListItemText
            className={styles.name}
            primary={label}
            secondary={size ? t('sizes_enum_' + size.toLowerCase()) : ''}
          />
          <ListItemText
            className={styles.quantity}
            primary={taxLength ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
            secondary={`Qt: ${quantity}`}
          />
          <Tooltip title={checked ? t('payment.remove_from_current_invoice') : t('payment.add_to_current_invoice')}>
            <div>
              <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} style={{ margin: '0px' }} />
            </div>
          </Tooltip>
          <CustomSelect
            className={styles.select}
            onChange={(value) => {
              updateQuantity(value, id);
            }}
            value={quantity}
            options={quantityOptions}
            label={t('quantity')}
          />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
