import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import Card from '@material-ui/core/Card';
import Button from '../../../components/Custom/Button';
import List from '../../../components/Custom/List';
import TextField from '../../../components/Custom/TextField';
import styles from './ChangePassword.module.css';

import { Store, ACTION_ENUM } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import { REQUEST_STATUS_ENUM } from '../../../../common/enums';

import { Auth } from 'aws-amplify';
import '../../../utils/amplify/amplifyConfig.jsx';

export default function ChangePassword() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const validate = (values) => {
    const errors = {};

    if (!values.oldPassword) {
      errors.oldPassword = t('value_is_required');
    } else if (values.oldPassword.length < 8 || values.oldPassword.length > 24) {
      errors.oldPassword = t('password_length');
    }

    if (!values.newPassword) {
      errors.newPassword = t('value_is_required');
    } else if (values.newPassword.length < 8 || values.newPassword.length > 24) {
      errors.newPassword = t('password_length');
    }

    if (!values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('value_is_required');
    } else if (values.newPassword !== values.newPasswordConfirm) {
      errors.newPasswordConfirm = t('password_must_match');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { oldPassword, newPassword } = values;
      await Auth.currentAuthenticatedUser()
        .then((user) => Auth.changePassword(user, oldPassword, newPassword))
        .then(() => {
          resetForm();
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('password_changed'),
            severity: 'success',
          });
        })
        .catch((err) => {
          if (err.code === REQUEST_STATUS_ENUM.UNAUTHORIZED) {
            // Token is expired, redirect
            goTo(ROUTES.login);
          } else if (err.code === REQUEST_STATUS_ENUM.FORBIDDEN) {
            // old password doesn't match
            formik.setFieldError('oldPassword', t('wrong_password'));
          }
        });
    },
  });

  return (
    <Card className={styles.card}>
      <List title={t('change_password')} />
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputs}>
          <TextField
            formik={formik}
            namespace="oldPassword"
            label={t('old_password')}
            type="password"
            className={styles.textField}
          />
          <TextField
            formik={formik}
            namespace="newPassword"
            label={t('new_password')}
            type="password"
            className={styles.textField}
          />
          <TextField
            formik={formik}
            namespace="newPasswordConfirm"
            label={t('confirm_new_password')}
            type="password"
            className={styles.textField}
          />
        </div>
        <Button color="primary" type="submit" className={styles.button}>
          {t('change_password')}
        </Button>
      </form>
    </Card>
  );
}
