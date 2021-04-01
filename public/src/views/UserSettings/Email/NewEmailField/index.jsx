import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import api from '../../../../actions/api';

import Add from '@material-ui/icons/AddCircle';

import styles from './NewEmailField.module.css';
import { TextField } from '../../../../components/Custom';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { Store } from '../../../../Store';
import * as Yup from 'yup';

export default function EmailField(props) {
  const {
    state: { authToken },
  } = useContext(Store);

  const { onSubmit } = props;
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('invalid.invalid_email')).required(t('value_is_required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { email } = values;

      const res = await api('/api/user/addEmail', {
        method: 'POST',
        body: JSON.stringify({
          authToken,
          email,
        }),
      });

      if (res.status === 200) {
        onSubmit();
      } else if (res.status === 403) {
        formik.setFieldError('email', t('email.email_already_used'));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.container}>
        <TextField namespace="email" label={t('new_email')} fullWidth className={styles.TextField} formik={formik} />
        <Tooltip title="Add new email to your account">
          <IconButton size="small" type="submit">
            <Add size="small" />
          </IconButton>
        </Tooltip>
      </div>
    </form>
  );
}
