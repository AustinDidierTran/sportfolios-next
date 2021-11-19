import React, { useEffect, useState, useContext } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Paper from '../../../components/Custom/Paper';
import List from '../../../components/Custom/List';
import styles from './Email.module.css';
import ConfirmedEmailField from './ConfirmedEmailField';
import partition from 'lodash/partition';
import api from '../../../actions/api';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Custom/Button';
import TextField from '../../../components/Custom/TextField';
import { addEmail } from '../../../actions/service/user';
import { Store, ACTION_ENUM } from '../../../Store';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Auth, Hub } from 'aws-amplify';
import { loadAddEmailConfig } from '../../../utils/amplify/amplifyConfig';
import { FEATURE_GOOGLE_LOGIN } from '../../../../../feature-flags';

export default function Email() {
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const [emails, setEmails] = useState([]);

  const fetchAllEmails = async () => {
    const { data } = await api('/api/user/emails', { method: 'GET' });
    setEmails(data);
  };

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const [confirmedEmails] = partition(emails, (email) => email.confirmed_email_at);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/.+@gmail\.com/, 'exemple@gmail.com')
      .email(t('invalid.invalid_email'))
      .required(t('value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { email } = values;
      await addEmail(userInfo.userId, email).then((data) => {
        resetForm();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('email_added'),
          severity: 'success',
        });
        fetchAllEmails();
      });
    },
  });

  loadAddEmailConfig();
  const loginGoogle = async () => {
    Auth.federatedSignIn({ provider: 'Google' });
  };

  return (
    <Paper className={styles.card}>
      <List title={t('my_email')} />
      <CardContent style={{ paddingTop: '0px' }}>
        {confirmedEmails.map((email, index) => (
          <ConfirmedEmailField email={email} key={index} />
        ))}
      </CardContent>
      <form onSubmit={formik.handleSubmit}>
        {FEATURE_GOOGLE_LOGIN && (
          <Button onClick={loginGoogle} color="primary" style={{ margin: '8px' }}>
            {t('google.add_gmail')}
          </Button>
        )}
      </form>
    </Paper>
  );
}
