import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '../../components/Custom/Container';
import Paper from '../../components/Custom/Paper';
import TextField from '../../components/Custom/TextField';
import * as yup from 'yup';

import { PASSWORD_LENGTH_ENUM } from '../../../common/config';
import { LOGO_ENUM } from '../../../common/enums';
import { AddGaEvent } from '../../components/Custom/Analytics';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const {
    state: { isAuthenticated },
    dispatch,
  } = React.useContext(Store);

  React.useEffect(() => {
    if (isAuthenticated) {
      const route = redirectUrl || ROUTES.home;
      router.push(route);
    }
  }, [isAuthenticated]);

  const validationSchema = yup.object().shape({
    email: yup.string().email(t('invalid.invalid_email')).required(t('value_is_required')),
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('password_length'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('password_length'))
      .required(t('value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 401) {
        // Email is not validated
        await api('/api/auth/sendConfirmationEmail', {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });
        formik.setFieldError('email', t('email.email_not_confirmed'));
      } else if (res.status === 403) {
        // Password is not good
        formik.setFieldError('password', t('email.email_password_no_match'));
      } else if (res.status === 404) {
        formik.setFieldError('email', t('no.no_existing_account_with_this_email'));
      } else {
        let { data } = res;

        if (data) {
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }
          const { token, userInfo } = data;

          dispatch({
            type: ACTION_ENUM.LOGIN,
            payload: token,
          });
          dispatch({
            type: ACTION_ENUM.UPDATE_USER_INFO,
            payload: userInfo,
          });
          if (redirectUrl) {
            goTo(decodeURI(redirectUrl));
          } else {
            goTo(ROUTES.home);
          }
        }
      }
    },
  });

  const goToSignUp = () => {
    if (redirectUrl) {
      goTo(ROUTES.signup, null, { redirectUrl });
    } else {
      goTo(ROUTES.signup);
    }
  };

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_512X512} height="200px" width="200px" />
      </div>
      <Paper className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TextField namespace="email" formik={formik} type="email" label={t('email.email')} fullWidth />
            <TextField namespace="password" formik={formik} label={t('password')} type="password" fullWidth />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              style={{ color: '#fff' }}
              onClick={() => {
                AddGaEvent({
                  category: 'Login',
                  action: 'User clicked to log in',
                  label: 'Login_page',
                });
              }}
            >
              {t('login')}
            </Button>
          </CardActions>
          <Divider />
          <CardActions className={styles.linksContainer}>
            <Typography
              style={{
                fontSize: 12,
                textDecoration: 'none',
                color: 'grey',
                margin: '0 auto',
                cursor: 'pointer',
              }}
              onClick={() => goTo(ROUTES.forgotPassword)}
            >
              {t('forgot_password')}
            </Typography>
          </CardActions>
        </form>
      </Paper>
      <div className={styles.or}>
        <Typography style={{ fontSize: 12 }}>{t('or')}</Typography>
      </div>
      <Button
        variant="outlined"
        color="primary"
        onClick={goToSignUp}
        className={styles.buttonSignup}
        style={{ borderWidth: '2px' }}
      >
        {t('signup')}
      </Button>
    </Container>
  );
}
