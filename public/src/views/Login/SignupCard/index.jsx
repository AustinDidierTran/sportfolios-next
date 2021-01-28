import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SignupCard.module.css';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '../../../components/Custom/Container';
import { LOGIN_STATE_ENUM, LOGO_ENUM } from '../../../../common/enums';
import Link from 'next/link';
import { ROUTES } from '../../../actions/goTo';

import loadable from '@loadable/component';

const Paper = loadable(() => import('../../../components/Custom/Paper'));
const TextField = loadable(() => import('../../../components/Custom/TextField'));

export default function SignupCard(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_256X256} height="200px" width="200px" />
      </div>
      <Paper className={styles.signup}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TextField namespace="firstName" formik={formik} type="text" label={t('first_name')} fullWidth />
            <TextField namespace="lastName" formik={formik} type="text" label={t('last_name')} fullWidth />
            <TextField namespace="email" formik={formik} type="email" label={t('email')} fullWidth />
            <TextField namespace="password" formik={formik} label={t('password')} type="password" fullWidth />
            <Typography variant="caption" color="textSecondary">
              {t('privacy_signup') + ' '}
              <Link target="_blank" rel="noopener noreferrer" href={ROUTES.privacyPolicy}>
                {t('here')}
              </Link>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              onClick={() => {
                formik.handleSubmit();
              }}
              style={{ color: '#fff' }}
            >
              {t('signup')}
            </Button>
          </CardActions>
          <Divider />
          <CardActions className={styles.linksContainer}>
            <div className={styles.typo} onClick={() => formik.setStatus({ state: LOGIN_STATE_ENUM.LOGIN })}>
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
        </form>
      </Paper>
    </Container>
  );
}
