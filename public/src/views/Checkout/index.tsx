import React, { useEffect, useState } from 'react';
import styles from './Checkout.module.css';
import ChoosePaymentMethod from './ChoosePaymentMethod';
import { formatPageTitle } from '../../utils/stringFormats';
import Paper from '../../components/Custom/Paper';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import { REQUEST_STATUS_ENUM } from '../../../common/enums';

const Checkout: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(null);

  useEffect(() => {
    document.title = formatPageTitle(t('checkout'));
    getTotal();
  }, []);

  useEffect(() => {
    if (total <= 0) {
      goTo(ROUTES.cart);
    }
  }, [total]);

  const getTotal = async (): Promise<void> => {
    setIsLoading(true);
    const { status, data } = await api('/api/shop/cartTotal', { method: 'GET' });
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setTotal(data.total);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <ChoosePaymentMethod response={total} />
      </Paper>
    </IgContainer>
  );
};

export default Checkout;
