import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginCard.module.css';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paper from '../../../components/Custom/Paper';
import TextField from '../../../components/Custom/TextField';

import { LOGIN_STATE_ENUM } from '../../../../common/enums';
import { AddGaEvent } from '../../../components/Custom/Analytics';

// import loadable from '@loadable/component';

// const Paper = loadable(() => import('../../../components/Custom/Paper'))
// const TextField = loadable(() => import('../../../components/Custom/TextField'))

export default function LoginCard(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Paper className={styles.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <TextField namespace="email" formik={formik} type="email" label={t('email')} fullWidth />
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
              formik.handleSubmit();
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
            onClick={() =>
              formik.setStatus({
                state: LOGIN_STATE_ENUM.FORGOT_PASSWORD,
              })
            }
          >
            {t('forgot_password')}
          </Typography>
        </CardActions>
      </form>
    </Paper>
  );
}
