import React, { useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ValidationAccount.module.css';

import Container from '../../components/Custom/Container';
import Paper from '../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '../../components/Custom/TextField';
import Button from '@material-ui/core/Button';

import { LOGO_ENUM, SEVERITY_ENUM } from '../../../common/enums';
import { useFormik } from 'formik';
import { goTo, ROUTES } from '../../actions/goTo';
import { COLORS } from '../../utils/colors';
import { ACTION_ENUM, Store } from '../../Store';
import * as yup from 'yup';

import { Auth } from 'aws-amplify';
import '../../utils/amplify/amplifyConfig.jsx';

interface IProps {
  email: string;
}

const ValidationAccount: React.FunctionComponent<IProps> = (props) => {
  const { email } = props;
  const { t } = useTranslation();
  const codeReg = /[0-9]{6}/;
  const { dispatch } = useContext(Store);

  const validationSchema = yup.object().shape({
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
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values) => {
      const { validationCode } = values;

      try {
        await Auth.confirmSignUp(email, validationCode);
        goTo(ROUTES.login);
      } catch (error) {
        formik.setFieldError('validationCode', t('code_validation.invalide_code'));
      }
    },
  });

  const resentEmail = async () => {
    try {
      await Auth.resendSignUp(email);
    } catch (err) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  return (
    <Container className={styles.container}>
      <div className={styles.logo}>
        <img src={LOGO_ENUM.LOGO_512X512} height="200px" width="200px" />
      </div>
      <Paper className={styles.signup}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <Typography className={styles.content}>{t('code_validation.code_message') + email}</Typography>
            <TextField namespace="validationCode" formik={formik} type="text" label={'validation code'} fullWidth />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={resentEmail}
              className={styles.button}
              style={{ color: COLORS.white }}
            >
              {'Resent email'}
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={styles.button}
              type="submit"
              style={{ color: COLORS.white }}
            >
              {t('submit')}
            </Button>
          </CardActions>
        </form>
      </Paper>
    </Container>
  );
};

export default ValidationAccount;
