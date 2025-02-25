import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './CartSummary.module.css';
import { formatPrice } from '../../../../utils/stringFormats';

export default function CartSummary(props) {
  const {
    total: { taxes, subtotal, total },
  } = props;

  const { t } = useTranslation();
  return (
    <Card style={{ marginTop: '16px' }}>
      <div className={styles.div}>
        <ListItemText primary={t('subtotal')} className={styles.primary} />
        <ListItemText secondary={formatPrice(subtotal)} />
      </div>
      {taxes.map((t, index) => (
        <div className={styles.div} key={index}>
          <ListItemText className={styles.primary} primary={`${t.displayName} (${t.percentage}%)`} />
          <ListItemText secondary={formatPrice(t.amount)} />
        </div>
      ))}
      <Divider />
      <div className={styles.total}>
        <ListItemText primary={t('total')} className={styles.primary} />
        <ListItemText primary={formatPrice(total)} />
      </div>
    </Card>
  );
}
