import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './PasswordRecovery.module.css';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '../../components/Custom/Paper';
import TextField from '../../components/Custom/TextField';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';
import { PASSWORD_LENGTH_ENUM } from '../../../common/config';
import { LOGO_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { COLORS } from '../../utils/colors';

import { Auth } from 'aws-amplify';
import '../../utils/amplify/amplifyConfig.jsx';

export default function PasswordRecovery() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const router = useRouter();
  const { email } = router.query;
  const codeReg = /[0-9]{6}/;

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('password_length'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('password_length'))
      .required(t('value_is_required')),
    validationCode: yup
      .string()
      .matches(codeReg, t('code_validation.only_number'))
      .min(6, t('code_validation.code_length'))
      .max(6, t('code_validation.code_length'))
      .required(t('code_validation.value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      validationCode: '',
      password: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { validationCode, password } = values;
      /*
      const res = await api('/api/auth/recoverPassword', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
        }),
      });
      */
      try {
        const res = await Auth.forgotPasswordSubmit(email, validationCode, password);
        if (res === 'SUCCESS') {
          const user = await Auth.signIn(email, password);
          console.log(user);
          const token = user.signInUserSession.idToken.jwtToken;
          const res = await api('/api/auth/loginWithCognito', {
            method: 'POST',
            body: JSON.stringify({
              email,
              token,
            }),
          });
          let { userInfo } = res;
          dispatch({
            type: ACTION_ENUM.LOGIN,
            payload: token,
          });
          dispatch({
            type: ACTION_ENUM.UPDATE_USER_INFO,
            payload: userInfo,
          });
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('password_reset_message'),
          });
          goTo(ROUTES.home);
        }
      } catch (err) {
        //console.log(err.code);
        if (err.code === REQUEST_STATUS_ENUM.FORBIDDEN) {
          // Token expired
          formik.setFieldError('password', t('token_expired'));
        } else if (err.code === 'ExpiredCodeException') {
          formik.setFieldError('validationCode', t('token_expired'));
        }
      }
    },
  });

  return (
    <div className={styles.main}>
      <Paper className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.logo}>
            <img className={styles.img} src={LOGO_ENUM.LOGO_512X512} />
          </div>
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {t('you.you_can_now_change_your_password', { email })}
            </Typography>
            <TextField
              namespace="validationCode"
              formik={formik}
              label={t('code_validation.message')}
              type="text"
              fullWidth
            />
            <TextField namespace="password" formik={formik} label={t('new_password')} type="password" fullWidth />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              style={{ color: COLORS.white }}
            >
              {t('reset_password')}
            </Button>
          </CardActions>
          <Divider />
        </form>
      </Paper>
    </div>
  );
}
