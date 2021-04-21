import React, { useEffect } from 'react';

import styles from './Checkout.module.css';

import ChoosePaymentMethod from './ChoosePaymentMethod';
import { formatPageTitle } from '../../utils/stringFormats';
import Paper from '../../components/Custom/Paper';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';

const Checkout = (props) => {
  const { total } = props;
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle(t('checkout'));
  }, []);

  if (total <= 0) {
    goTo(ROUTES.cart);
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
