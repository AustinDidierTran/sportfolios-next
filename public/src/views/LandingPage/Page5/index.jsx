import React, { useContext } from 'react';

import styles from '../LandingPage.module.css';
import { LOGO_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import MobileContainer from '../../../components/Custom/MobileContainer';
import Button from '../../../components/Custom/Button';
import TextField from '../../../components/Custom/TextField';
import Typography from '@material-ui/core/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ERROR_ENUM } from '../../../../common/errors';
import { AddGaEvent } from '../../../components/Custom/Analytics';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';

export default function Page5() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    email: yup.string().email().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    message: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { name, email, message } = values;
      const res = await api('/api/notifications/sendMessageToSportfoliosAdmin', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('message_sent'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
        formik.setFieldValue('message', '');
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(ERROR_ENUM.ERROR_OCCURED),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  });

  return (
    <div className={styles.greenContainer}>
      <MobileContainer>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.block}>
            <Typography className={styles.text} style={{ marginTop: '32px' }} variant="h2">
              {t('contact_us')}
            </Typography>
            <div className={styles.logo}>
              <img src={LOGO_ENUM.WHITE_LOGO_1024X1024} height="200px" width="200px" />
            </div>
            <Typography className={styles.text} variant="h5">
              {t('name')}
            </Typography>
            <TextField
              inputProps={{ style: { textAlign: 'center', paddingTop: '10px' } }}
              namespace="name"
              formik={formik}
              variant="filled"
              className={styles.textField}
            />
            <Typography className={styles.text} variant="h5">
              {t('email.email')}
            </Typography>
            <TextField
              inputProps={{ style: { textAlign: 'center', paddingTop: '10px' } }}
              namespace="email"
              formik={formik}
              variant="filled"
              className={styles.textField}
            />
            <Typography className={styles.text} variant="h5">
              {t('message')}
            </Typography>
            <TextField
              namespace="message"
              formik={formik}
              variant="filled"
              className={styles.textField}
              multiline
              rows={7}
              rowsMax={7}
            />
            <Button
              type="submit"
              style={{ marginTop: '16px', marginBottom: '16px' }}
              onClick={() => {
                AddGaEvent({
                  category: 'Landing page',
                  action: 'User sent a message from landing page',
                  label: 'landing_page_message',
                });
              }}
              className={styles.button}
            >
              {t('send')}
            </Button>
          </div>
        </form>
      </MobileContainer>
    </div>
  );
}
