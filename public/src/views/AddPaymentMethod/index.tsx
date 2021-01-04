import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Typography } from '@material-ui/core';
import { Button, IgContainer, LoadingSpinner, Paper, TextField } from '../../components/Custom';
import CountrySelect from '../AddBankAccount/CountrySelect';
import CardSection from '../../utils/stripe/Payment/CardSection';

// @ts-ignore
import styles from './AddPaymentMethod.module.css';
import { useTranslation } from 'react-i18next';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import api from '../../actions/api';
import { goTo } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';
import { SEVERITY_ENUM } from '../../../common/enums';

interface IProps {
  redirect: string;
}

interface IError {
  name?: string;
  email?: string;
  phoneNumber?: string;
  line1?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;
}

const AddPaymentMethod: React.FunctionComponent<IProps> = (props) => {
  const { redirect } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const stripe = useStripe();
  const elements = useElements();
  const isANumber = (number) => isNaN(Number(number));

  const validate = (values) => {
    const errors: IError = {};

    const { name, email, phoneNumber, line1, city, country, state, postalCode } = values;

    if (!name) {
      errors.name = t('value_is_required');
    }
    if (!email) {
      errors.email = t('value_is_required');
    }
    if (!phoneNumber) {
      errors.phoneNumber = t('value_is_required');
    } else if (isANumber(phoneNumber)) {
      errors.phoneNumber = t('value_must_be_numeric');
    }

    if (!line1) {
      errors.line1 = t('value_is_required');
    }
    if (!city) {
      errors.city = t('value_is_required');
    }
    if (!country) {
      errors.country = t('value_is_required');
    }
    if (!state) {
      errors.state = t('value_is_required');
    }
    if (!postalCode) {
      errors.postalCode = t('value_is_required');
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: { country: 'CA' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { token: stripeToken } = await stripe.createToken(elements.getElement(CardElement));

      const params = { ...values, stripeToken };
      const res = await api('/api/stripe/paymentMethod', {
        method: 'POST',
        body: JSON.stringify(params),
      });

      if (res.status === 200) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('credit_card_added'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
        goTo(redirect);
      }
    },
  });

  if (formik.isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.content}>
            <Typography gutterBottom variant="h5" component="h2">
              {t('personal_information')}
            </Typography>
            <TextField namespace="name" formik={formik} type="name" label={t('name')} fullWidth />
            <TextField namespace="email" formik={formik} type="email" label={t('email')} fullWidth />
            <TextField namespace="phoneNumber" formik={formik} type="phoneNumber" label={t('phone_number')} fullWidth />
            <br />
            <br />
            <Typography gutterBottom variant="h5" component="h2">
              {t('address')}
            </Typography>
            <TextField namespace="line1" formik={formik} type="line1" label={t('line1')} fullWidth />
            <TextField namespace="line2" formik={formik} type="line2" label={t('line2')} fullWidth />
            <TextField namespace="city" formik={formik} type="city" label={t('city')} fullWidth />
            <CountrySelect formik={formik} />
            <TextField namespace="state" formik={formik} type="state" label={t('state')} fullWidth />
            <TextField namespace="postalCode" formik={formik} type="postalCode" label={t('postal_code')} fullWidth />
            <br />
            <br />
            <CardSection />
          </div>
          <Button
            color="secondary"
            style={{ margin: '16px', width: '25%' }}
            onClick={() => {
              goTo(redirect);
            }}
          >
            {t('cancel')}
          </Button>
          <Button color="primary" type="submit" style={{ margin: '16px', width: '25%' }}>
            {t('submit')}
          </Button>
          <br />
          <br />
        </form>
      </Paper>
    </IgContainer>
  );
};

export default AddPaymentMethod;
