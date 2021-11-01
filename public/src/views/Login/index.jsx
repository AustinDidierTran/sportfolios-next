import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '../../components/Custom/Container';
import Icon from '../../components/Custom/Icon';
import Paper from '../../components/Custom/Paper';
import TextField from '../../components/Custom/TextField';
import * as yup from 'yup';

import { PASSWORD_LENGTH_ENUM } from '../../../common/config';
import { LOGO_ENUM, AuthErrorTypes } from '../../../common/enums';
import { AddGaEvent } from '../../components/Custom/Analytics';
import { useRouter } from 'next/router';
import { ACTION_ENUM, Store } from '../../Store';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { COLORS } from '../../utils/colors';
import { ERROR_ENUM, errors } from '../../../common/errors';

import { Auth } from 'aws-amplify';
import '../../utils/amplify/amplifyConfig.jsx';
import { loginWithCognito, migrate } from '../../actions/service/auth/auth';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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

      const migrateFct = async (error) => {
        console.log('inside migrateFct', error.code, AuthErrorTypes.NotAuthorizedException);
        if (error.code === AuthErrorTypes.NotAuthorizedException) {
          console.log('first error code, should go here');
          const res = await migrate(email, password);

          if (res.status === 200) {
            await Auth.signIn(email, password)
              .then((user) => {
                Auth.completeNewPassword(user, password).then((user) => login(user, email));
              })
              .catch((err) => formik.setFieldError('password', t('email.email_password_no_match')));
          }
        } else if (error === errors[ERROR_ENUM.UNCONFIRMED_EMAIL].code) {
          console.log('not here');
          // Email is not validated
          formik.setFieldError('email', t('email.email_not_confirmed'));
        } else if (error === errors[ERROR_ENUM.ERROR_OCCURED].code) {
          console.log('or here');
          // Password is not good
          formik.setFieldError('password', t('email.email_password_no_match'));
        } else if (error === errors[ERROR_ENUM.INVALID_EMAIL].code) {
          console.log('nor there');
          formik.setFieldError('email', t('no.no_existing_account_with_this_email'));
        } else {
          console.log('inside else...');
        }
      };

      try {
        const user = await Auth.signIn(email, password)
          .then((user) => {
            if (user.challengeName === AuthErrorTypes.NewPasswordRequired) {
              return Auth.completeNewPassword(user, password);
            }
            return user;
          })
          .catch((err) => {
            console.log('inside catch', err);
            // [REFACTORING - Claude]
            migrateFct(err);
          });
        login(user, email);
      } catch (error) {
        migrateFct(error);
        console.log('testing error code', error.code, AuthErrorTypes.NotAuthorizedException);
        // if (error.code === AuthErrorTypes.NotAuthorizedException) {
        //   const res = await migrate(email, password);

        //   if (res.status === 200) {
        //     await Auth.signIn(email, password)
        //       .then((user) => {
        //         Auth.completeNewPassword(user, password).then((user) => login(user, email));
        //       })
        //       .catch((err) => formik.setFieldError('password', t('email.email_password_no_match')));
        //   }
        // } else if (error === errors[ERROR_ENUM.UNCONFIRMED_EMAIL].code) {
        //   // Email is not validated
        //   formik.setFieldError('email', t('email.email_not_confirmed'));
        // } else if (error === errors[ERROR_ENUM.ERROR_OCCURED].code) {
        //   // Password is not good
        //   formik.setFieldError('password', t('email.email_password_no_match'));
        // } else if (error === errors[ERROR_ENUM.INVALID_EMAIL].code) {
        //   formik.setFieldError('email', t('no.no_existing_account_with_this_email'));
        // }
      }
    },
  });

  const goToSignUp = () => {
    if (redirectUrl) {
      goTo(ROUTES.signup, null, { redirectUrl: encodeURIComponent(redirectUrl) });
    } else {
      goTo(ROUTES.signup);
    }
  };

  const login = async (user, email) => {
    const token = user.signInUserSession.idToken.jwtToken;
    const data = await loginWithCognito(email, token);

    if (data) {
      if (typeof data.data === 'string') {
        data.data = JSON.parse(data.data);
      }
      const { userInfo } = data.data;

      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: token,
      });
      dispatch({
        type: ACTION_ENUM.UPDATE_USER_INFO,
        payload: userInfo,
      });
      if (redirectUrl) {
        goTo(redirectUrl);
      } else {
        goTo(ROUTES.home);
      }
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
            <TextField
              namespace="password"
              formik={formik}
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showPassword ? t('hide_password') : t('show_password')}>
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <Icon icon="Visibility" /> : <Icon icon="VisibilityOff" />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              style={{ color: COLORS.white }}
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
                color: COLORS.grey,
                margin: '0 auto',
                cursor: 'pointer',
              }}
              onClick={() => goTo(ROUTES.forgotPassword)}
            >
              {t('forgot_password')}
            </Typography>
          </CardActions>
          <CardActions className={styles.linksContainer}>
            <Typography
              style={{
                fontSize: 12,
                textDecoration: 'none',
                color: COLORS.grey,
                margin: '0 auto',
                cursor: 'pointer',
              }}
              onClick={() => goTo(ROUTES.resentValidationCode)}
            >
              {t('code_validation.resent_validation_code')}
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
