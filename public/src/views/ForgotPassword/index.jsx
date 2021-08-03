import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ForgotPassword.module.css';
import Button from '../../components/Custom/Button';
import Paper from '../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '../../components/Custom/TextField';
import Container from '../../components/Custom/Container';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { LOGO_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';
import { ACTION_ENUM, Store } from '../../Store';
import { COLORS } from '../../utils/colors';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { dispatch } = React.useContext(Store);

  const validationSchema = yup.object().shape({
    email: yup.string().email(t('invalid.invalid_email')).required(t('value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { email } = values;
      const res = await api('/api/auth/recoveryEmail', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status === REQUEST_STATUS_ENUM.ERROR) {
        // Email not found
        formik.setFieldError('email', t('email.email_not_found'));
      }
      if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('confirmation_email_sent'),
        });
      }
    },
  });

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_512X512} height="200px" width="200px" />
      </div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Paper className={styles.card}>
            <CardContent>
              <TextField namespace="email" formik={formik} type="email" label={t('email.email')} fullWidth />
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
                {t('send_password_recovery_email')}
              </Button>
            </CardActions>
            <Divider />
            <CardActions className={styles.linksContainer}>
              <Typography
                style={{
                  fontSize: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                  color: COLORS.grey,
                  margin: '0 16px',
                  cursor: 'pointer',
                }}
                onClick={() => goTo(ROUTES.login)}
              >
                {t('have_an_account_signin')}
              </Typography>
              <Typography
                style={{
                  fontSize: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                  color: COLORS.grey,
                  margin: '0 16px',
                  cursor: 'pointer',
                }}
                onClick={() => goTo(ROUTES.signup)}
              >
                {t('no.no_account_signup')}
              </Typography>
            </CardActions>
          </Paper>
        </form>
      </div>
    </Container>
  );
}
