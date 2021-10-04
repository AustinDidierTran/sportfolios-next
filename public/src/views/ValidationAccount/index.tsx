import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ValidationAccount.module.css';

import Container from '../../components/Custom/Container';
import Paper from '../../components/Custom/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '../../components/Custom/TextField';
import Button from '@material-ui/core/Button';

import { LOGO_ENUM } from '../../../common/enums';
import { useFormik } from 'formik';
import { goTo, ROUTES } from '../../actions/goTo';
import { COLORS } from '../../utils/colors';
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

  const validationSchema = yup.object().shape({
    validationCode: yup
      .string()
      .matches(codeReg, 'only_number')
      .min(6, 'code_length')
      .max(6, 'code_length')
      .required('value_is_required'),
  });

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values) => {
      const { code } = values;
      try {
        await Auth.confirmSignUp(email, code);
      } catch (error) {
        console.log('error confirming sign up', error);
      }
    },
  });

  const resentEmail = async () => {
    try {
      await Auth.resendSignUp(email);
    } catch (err) {
      console.log('error resending code: ', err);
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
            <Typography className={styles.content}>{'Validation du compte ' + email}</Typography>
            <TextField namespace="validationCode" formik={formik} type="text" label={'validation code'} fullWidth />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
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
              {'Valider'}
            </Button>
          </CardActions>
        </form>
      </Paper>
    </Container>
  );
};

export default ValidationAccount;
