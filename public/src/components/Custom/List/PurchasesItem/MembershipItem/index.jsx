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

export default function MembershipItem(props) {
  const { organization, person, createdAt, amount, label, goToReceipt } = props;

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
            primary={formatPrice(amount)}
            secondary={`${person?.name} ${person?.surname}`}
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
