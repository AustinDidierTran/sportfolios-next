import React from 'react';
import Paper from '../../../components/Custom/Paper';
import Stepper from '../../../components/Custom/Stepper';

export default function CheckoutStepper(props) {
  return (
    <Paper title="Checkout">
      <Stepper {...props} />
    </Paper>
  );
}
