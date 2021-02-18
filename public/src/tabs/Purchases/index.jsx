import React from 'react';
import { List, LoadingSpinner } from '../../components/Custom';
import { useApiRoute } from '../../hooks/queries';
import { LIST_ITEM_ENUM } from '../../../common/enums';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

export default function PurchasesTab() {
  const { t } = useTranslation();
  const { response: purchases, isLoading } = useApiRoute('/api/shop/purchases');
  if (isLoading) {
    return <LoadingSpinner />;
  }
  const formatPurchases = () =>
    purchases
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
      .map((p, index) => ({
        ...p,
        type: LIST_ITEM_ENUM.PURCHASES,
        key: index,
      }));

  if (purchases.length < 1) {
    return <Typography color="textSecondary">{t('no.no_purchases_message')}</Typography>;
  }
  return <List items={formatPurchases()} />;
}
