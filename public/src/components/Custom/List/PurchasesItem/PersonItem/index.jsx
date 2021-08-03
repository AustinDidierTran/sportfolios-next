import React from 'react';
import CustomAvatar from '../../../Avatar';
import CustomIconButton from '../../../IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import styles from '../PurchasesItem.module.css';
import { useTranslation } from 'react-i18next';
import { IMAGE_ENUM } from '../../../../../../common/enums';
import { formatPrice, formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';

export default function PersonItem(props) {
  const { photoUrl, description, metadata, personName, createdAt, amount, label, goToReceipt } = props;

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
            />
          </ListItemIcon>
          <ListItemText className={styles.name} primary={description} secondary={personName} />
          <ListItemText
            className={styles.quantity}
            primary={metadata?.isIndividualOption ? `${formatPrice(amount)} - ${metadata?.name}` : formatPrice(amount)}
            secondary={label}
          />
          <CustomIconButton onClick={goToReceipt} tooltip={t('receipt')} icon="Receipt" style={{ color: 'primary' }} />
          <ListItemText
            className={styles.date}
            secondary={`${t('purchased_on')}: ${formatDate(moment.utc(createdAt))}`}
          />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
