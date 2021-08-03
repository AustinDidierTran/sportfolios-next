import React, { useState, useEffect, useContext } from 'react';
import { List, LoadingSpinner } from '../../components/Custom';
import { LIST_ITEM_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import { Store } from '../../Store';
export default function PurchasesTab() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState(false);
  const {
    state: { isAuthenticated },
  } = useContext(Store);

  useEffect(() => {
    if (isAuthenticated) {
      getPurchases();
    }
  }, [isAuthenticated]);

  const getPurchases = async () => {
    setIsLoading(true);
    const { data, status } = await api('/api/shop/purchases', { method: 'GET' });
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setPurchases(formatPurchases(data));
    } else {
      setPurchases([]);
    }
    setIsLoading(false);
  };

  const formatPurchases = (purchases) =>
    purchases
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
      .map((p, index) => ({ ...p, type: LIST_ITEM_ENUM.PURCHASES, key: index }));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (purchases.length < 1) {
    return <Typography color="textSecondary">{t('no.no_purchases_message')}</Typography>;
  }
  return <List items={purchases} />;
}
