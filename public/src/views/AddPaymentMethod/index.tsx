import React from 'react';
import { useFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '../../components/Custom/Button';
import IgContainer from '../../components/Custom/IgContainer';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Paper from '../../components/Custom/Paper';
import TextField from '../../components/Custom/TextField';
import PhoneNumberFormat from '../../components/Custom/PhoneNumberFormat';
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
import { ERROR_ENUM } from '../../../common/errors';
import * as yup from 'yup';

interface IProps {
  redirect: string;
}

const AddPaymentMethod: React.FunctionComponent<IProps> = (props) => {
  const { redirect } = props;
  const { t } = useTranslation();
  const { dispatch } = React.useContext(Store);
  const stripe = useStripe();
  const elements = useElements();
  const [stripeToken, setStripeToken] = React.useState();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    email: yup.string().email().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    phoneNumber: yup.number().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    line1: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    city: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    country: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    state: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    postalCode: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: { country: 'CA' },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (!stripeToken) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(ERROR_ENUM.ERROR_OCCURED),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      }
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
              {t('person.personal_information')}
            </Typography>
            <TextField namespace="name" formik={formik} type="name" label={t('name')} fullWidth className={styles.textField} />
            <TextField namespace="email" formik={formik} type="email" label={t('email.email')} fullWidth className={styles.textField} />
            <TextField InputProps={{
              inputComponent: PhoneNumberFormat,
            }} namespace="phoneNumber" formik={formik} type="phoneNumber" label={t('phone_number')} fullWidth className={styles.textField} placeholder="(###)-###-####" multiline />
            <br />
            <br />
            <Typography gutterBottom variant="h5" component="h2">
              {t('billing_address')}
            </Typography>
            <TextField namespace="line1" formik={formik} type="line1" label={t('line1')} fullWidth className={styles.textField}/>
            <TextField namespace="line2" formik={formik} type="line2" label={t('line2')} fullWidth className={styles.textField}/>
            <TextField namespace="city" formik={formik} type="city" label={t('city')} fullWidth className={styles.textField}/>
            <CountrySelect formik={formik} className={styles.textField}/>
            <TextField namespace="state" formik={formik} type="state" label={t('state')} fullWidth className={styles.textField}/>
            <TextField namespace="postalCode" formik={formik} type="postalCode" label={t('postal_code')} fullWidth className={styles.textField}/>
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
          <Button
            color="primary"
            onClick={async () => {
              const { token } = await stripe!.createToken(elements!.getElement(CardElement)!);
              //@ts-ignore
              setStripeToken(token);
              formik.handleSubmit();
            }}
            style={{ margin: '16px', width: '25%' }}
          >
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
