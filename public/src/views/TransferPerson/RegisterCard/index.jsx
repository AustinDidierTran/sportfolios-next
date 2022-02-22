import React from 'react';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';
import styles from './RegisterCard.module.css';
import { COLORS } from '../../../utils/colors';
import { TextField } from '../../../components/Custom';

export default function RegisterCard(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Paper className={styles.signup}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <Typography
            style={{
              fontSize: 16,
              textDecoration: 'none',
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            {t('create.create_an_account_to_accept_person_transfer')}
          </Typography>
          <TextField namespace="email" formik={formik} type="email" label={t('email.email')} fullWidth />
          <TextField namespace="password" formik={formik} label={t('password')} type="password" fullWidth />
        </CardContent>
        <CardActions>
          <Button
            className={styles.button}
            size="small"
            color="primary"
            variant="contained"
            type="submit"
            style={{ color: COLORS.white }}
            fullWidth
          >
            {t('signup')}
          </Button>
        </CardActions>
      </form>
    </Paper>
  );
}
