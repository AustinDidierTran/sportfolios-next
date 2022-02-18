import React from 'react';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import styles from './StripeElement.module.css';
import LabelAndInput from '../LabelAndInput';
import { useTranslation } from 'react-i18next';
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      width: '100%',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  // hidePostalCode: true,
};

const StripeElement: React.FunctionComponent<Record<string, unknown>> = () => {
  const { t } = useTranslation();
  return (
    <>
      <LabelAndInput label={t('stripe.card_number')}>
        <CardNumberElement options={CARD_ELEMENT_OPTIONS} className={styles.number} />
      </LabelAndInput>
      <LabelAndInput label={t('stripe.expiry_date')}>
        <CardExpiryElement options={CARD_ELEMENT_OPTIONS} className={styles.expiry} />
      </LabelAndInput>
      <LabelAndInput label={t('stripe.verification_code')}>
        <CardCvcElement options={CARD_ELEMENT_OPTIONS} className={styles.cvc} />
      </LabelAndInput>
    </>
  );
  // return <div>Hello World!</div>;
};

export default StripeElement;
