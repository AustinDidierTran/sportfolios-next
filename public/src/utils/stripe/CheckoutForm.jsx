import React, { useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import CardSection from './CardSection';
import Button from '@material-ui/core/Button';

import api from '../../actions/api';
import { useFormInput } from '../../hooks/forms';
import TextField from '../../components/Custom/TextField';
import styles from './CheckoutForm.module.css';
import { Store } from '../../Store';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const {
    state: { id },
  } = useContext(Store);
  const name = useFormInput('');
  const amount = useFormInput();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const paymentIntent = await api('/api/stripe/paymentIntent', {
      method: 'POST',
      body: JSON.stringify({ id: id, amount: amount.value }),
    });
    const secret = paymentIntent.data.client_secret;

    const res = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name.value,
        },
      },
    });

    if (res.error) {
      // Show error to your customer (e.g., insufficient funds)
      /* eslint-disable-next-line */
      console.log(res.error.message);
    } else {
      // The payment has been processed!
      /* eslint-disable-next-line */
      console.log('payment processed');
      if (res.paymentIntent.status === 'succeeded') {
        /* eslint-disable-next-line */
        console.log('res', res);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.main}>
        <div className={styles.name}>
          <TextField {...name.inputProps} placeholder="Name" />
        </div>
        <div className={styles.amount}>
          <TextField {...amount.inputProps} placeholder="Amount" />
        </div>
        <CardSection className={styles.card} />
        <Button disabled={!stripe} className={styles.button} onClick={handleSubmit}>
          Confirm order
        </Button>
      </div>
    </form>
  );
}
