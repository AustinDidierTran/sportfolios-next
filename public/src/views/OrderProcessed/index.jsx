import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatPageTitle } from '../../utils/stringFormats';

import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import IgContainer from '../../components/Custom/IgContainer';
import Typography from '@material-ui/core/Typography';
import styles from './OrderProcessed.module.css';
import { LOGO_ENUM } from '../../../common/enums';
import { goTo } from '../../actions/goTo';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../Store';
import api from '../../actions/api';

export default function OrderProcessed() {
  const router = useRouter();
  const { paid, last4, receiptUrl } = router.query;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const updateCart = async () => {
    const { data: cartItems } = await api('/api/shop/getCartItems', { method: 'GET' });
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: cartItems,
    });
  };

  useEffect(() => {
    document.title = formatPageTitle(t('order_processed_title'));
    updateCart();
  }, []);

  const goToReceipt = () => {
    window.open(receiptUrl);
  };

  const totalFormatted = formatPrice(paid);

  const cardNumber = '**** **** **** ' + last4;

  return (
    <IgContainer>
      <Paper style={{ textAlign: 'center' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
        </div>
        <Typography style={{ margin: '8px' }} variant="h5">
          {t('order_processed')}
        </Typography>
        <Typography style={{ margin: '8px' }}>
          Total:&nbsp;
          {totalFormatted}
        </Typography>
        <Typography style={{ margin: '8px' }}>
          {t('payment.paid_with')}
          &nbsp;
          {cardNumber}
        </Typography>
        <Typography style={{ margin: '8px' }} color="textSecondary" component="p">
          {t('to_see_your_receipt')}
        </Typography>
        <Button
          size="small"
          variant="contained"
          endIcon="Home"
          style={{
            margin: '8px',
          }}
          onClick={() => {
            goTo('/');
          }}
        >
          {t('home.title')}
        </Button>
        <Button
          size="small"
          variant="contained"
          endIcon="Receipt"
          style={{
            margin: '8px',
          }}
          onClick={goToReceipt}
        >
          {t('receipt')}
        </Button>
      </Paper>
    </IgContainer>
  );
}
