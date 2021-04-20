import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Signup.module.css';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '../../components/Custom/Container';
import Paper from '../../components/Custom/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '../../components/Custom/TextField';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { PASSWORD_LENGTH_ENUM } from '../../../common/config';
import { LOGO_ENUM } from '../../../common/enums';
import Link from 'next/link';
import { goTo, ROUTES } from '../../actions/goTo';
import * as yup from 'yup';
import { useFormik } from 'formik';
import api from '../../actions/api';
import { useRouter } from 'next/router';

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const [isSubscribed, setIsSubcribed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(t('value_is_required')),
    lastName: yup.string(),
    email: yup.string().email(t('invalid.invalid_email')).required(t('value_is_required')),
    password: yup
      .string()
      .min(PASSWORD_LENGTH_ENUM.MIN_LENGTH, t('password_length'))
      .max(PASSWORD_LENGTH_ENUM.MAX_LENGTH, t('password_length'))
      .required(t('value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values) => {
      const { firstName, lastName, email, password } = values;
      const res = await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          redirectUrl: encodeURIComponent(redirectUrl),
          newsLetterSubscription: isSubscribed,
        }),
      });
      if (res.status === 403) {
        formik.setFieldError('email', t('email.email_already_used'));
      } else if (res.status >= 400) {
        formik.setFieldError('firstName', t('something_went_wrong'));
      } else {
        goTo(ROUTES.confirmationEmailSent, { email });
      }
    },
  });

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_512X512} height="200px" width="200px" />
      </div>
      <Paper className={styles.signup}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TextField namespace="firstName" formik={formik} type="text" label={t('first_name')} fullWidth />
            <TextField namespace="lastName" formik={formik} type="text" label={t('last_name')} fullWidth />
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
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <div className={styles.subscribe}>
              <Checkbox
                className={styles.checkbox}
                checked={isSubscribed}
                color="default"
                onChange={() => {
                  setIsSubcribed(!isSubscribed);
                }}
              ></Checkbox>
              <label>
                <Typography color="textSecondary">{t('newsletter_subscribe')}</Typography>
              </label>
            </div>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              style={{ color: '#fff' }}
            >
              {t('signup')}
            </Button>
          </CardActions>
          <Divider />
          <CardActions className={styles.linksContainer}>
            <div className={styles.typo} onClick={() => goTo(ROUTES.login)}>
              <Typography
                style={{
                  textDecoration: 'none',
                  color: 'grey',
                  margin: '0 auto',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {t('have_an_account_signin')}
              </Typography>
            </div>
          </CardActions>
          <Divider />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              {t('privacy_signup') + ' '}
            </Typography>
            <Typography variant="caption" style={{ color: 'blue', textDecoration: 'underline' }}>
              <Link target="_blank" rel="noopener noreferrer" href={ROUTES.privacyPolicy}>
                {t('here')}
              </Link>
            </Typography>
          </CardContent>
        </form>
      </Paper>
    </Container>
  );
}
