import React from 'react';
import CustomAvatar from '../../../Avatar';
import CustomIconButton from '../../../IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import styles from '../PurchasesItem.module.css';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';

export default function ShopItem(props) {
  const { photoUrl, size, quantity, createdAt, amount, label, goToReceipt } = props;

  const { t } = useTranslation();

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <CustomAvatar photoUrl={photoUrl} variant="square" className={styles.photo}></CustomAvatar>
          </ListItemIcon>
          <ListItemText className={styles.name} primary={label} secondary={t(size) || ''}></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
            secondary={t('Qt', { quantity })}
          ></ListItemText>
          <CustomIconButton onClick={goToReceipt} tooltip={t('receipt')} icon="Receipt" style={{ color: 'primary' }} />
          <ListItemText
            className={styles.date}
            secondary={`${t('purchased_on')}: ${formatDate(moment(createdAt))}`}
          ></ListItemText>
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
