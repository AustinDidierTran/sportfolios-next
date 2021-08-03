import React, { useContext, useEffect, useState } from 'react';
import api from '../../../actions/api';
import Button from '../../../components/Custom/Button';
import RadioGroup from '../../../components/Custom/RadioGroup';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import ContainerBottomFixed from '../../../components/Custom/ContainerBottomFixed';
import { goTo, goBack, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { checkout } from '../../../utils/stripe';
import styles from './ChoosePaymentMethod.module.css';
import Typography from '@material-ui/core/Typography';
import { LOGO_ENUM, REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { formatPrice } from '../../../utils/stringFormats';
import { ACTION_ENUM, Store } from '../../../Store';
import { ERROR_ENUM } from '../../../../common/errors';
import CustomIconButton from '../../../components/Custom/IconButton';

export default function ChoosePaymentMethod(props) {
  const { response } = props;
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const getPaymentMethods = async () => {
    setIsLoading(true);
    const { data } = await api('/api/stripe/paymentMethods', { method: 'GET' });
    data.forEach((d) => {
      if (d.is_default) {
        setPaymentMethod(d.payment_method_id);
      }
    });
    const pms = data.map((d) => ({
      display: t('card_ending_with', { last4: d.last4 }),
      value: d.payment_method_id,
      last4: d.last4,
    }));
    setPaymentMethods(pms);
    setIsLoading(false);
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const pay = async () => {
    setIsPaying(true);
    const res = await checkout(paymentMethod);
    const { data, status } = res;
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      goTo(ROUTES.orderProcessed, null, {
        paid: data?.invoice?.amount_paid,
        last4: paymentMethods.find((p) => p.value === paymentMethod).last4,
        receiptUrl: data?.receiptUrl,
      });
    } else {
      if (data.reason) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(data.reason),
          severity: SEVERITY_ENUM.ERROR,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    }
    setIsPaying(false);
  };

  const onChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isPaying) {
    return (
      <div>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
        </div>
        <Typography>{t('waiting_for_payment')}</Typography>
        <LoadingSpinner isComponent />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16, textAlign: 'center' }}>
      <div className={styles.header}>
        <CustomIconButton
          icon="ArrowBack"
          onClick={() => goBack()}
          tooltip={t('return_cart')}
          className={styles.iconButton}
          style={{ color: 'primary' }}
        />
      </div>
      <div className={styles.logo}>
        <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
      </div>
      <Typography variant="h6" style={{ marginBottom: '8px' }}>
        {t('payment.add_payment_options', { amount: formatPrice(response) })}
      </Typography>
      <RadioGroup
        namespace="paymentMethod"
        options={paymentMethods}
        title={t('select.select_payment_method')}
        onChange={onChange}
        value={paymentMethod}
        centered
      />
      <br />
      {paymentMethods.length ? (
        <>
          <Button color="default" style={{ margin: '4px' }} onClick={() => goTo(ROUTES.userSettings)}>
            {t('edit.edit_credit_cards')}
          </Button>
          <Button
            color="default"
            style={{ margin: '4px' }}
            onClick={() =>
              goTo(ROUTES.addPaymentMethod, null, {
                redirect: ROUTES.checkout,
              })
            }
          >
            {t('add.add_credit_card')}
          </Button>
        </>
      ) : (
        <Button
          color="primary"
          style={{ marginTop: '8px' }}
          onClick={() =>
            goTo(ROUTES.addPaymentMethod, null, {
              redirect: ROUTES.checkout,
            })
          }
        >
          {t('add.add_credit_card')}
        </Button>
      )}

      <ContainerBottomFixed>
        <Button disabled={!paymentMethod} onClick={pay} style={{ margin: 8 }}>
          {t('payment.pay')}
        </Button>
      </ContainerBottomFixed>
    </div>
  );
}
