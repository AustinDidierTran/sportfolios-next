import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ForgotPasswordCard.module.css';

import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '../../../components/Custom/TextField';
import Container from '../../../components/Custom/Container';

import { LOGO_ENUM, LOGIN_STATE_ENUM } from '../../../../common/enums';

export default function ForgotPassword(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_256X256} height="200px" width="200px" />
      </div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Paper className={styles.card}>
            <CardContent>
              <TextField namespace="email" formik={formik} type="email" label={t('email')} fullWidth />
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
                  color: 'grey',
                  margin: '0 16px',
                  cursor: 'pointer',
                }}
                onClick={() => formik.setStatus({ state: LOGIN_STATE_ENUM.LOGIN })}
              >
                {t('have_an_account_signin')}
              </Typography>
              <Typography
                style={{
                  fontSize: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                  color: 'grey',
                  margin: '0 16px',
                  cursor: 'pointer',
                }}
                onClick={() => formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP })}
              >
                {t('no_account_signup')}
              </Typography>
            </CardActions>
          </Paper>
        </form>
      </div>
    </Container>
  );
}
