import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import Table from '../../../components/Custom/Table';
import CardContent from '@material-ui/core/CardContent';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM, NUMBER_STATUS_ENUM } from '../../../../common/enums';
import FormDialog from '../../../components/Custom/FormDialog';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../common/errors';
import { formatRoute } from '../../../utils/stringFormats';

export default function LandingPageEmail() {
  const { t } = useTranslation();
  const [emails, setEmails] = useState([]);
  const [open, setOpen] = useState(false);
  const { dispatch } = useContext(Store);

  const getEmails = async () => {
    const res = await api('/api/admin/emailsLandingPage');
    const data = res.data.map((r) => ({
      email: r,
      icon: 'Delete',
      onIconButtonClick: () => {
        onDelete(r);
      },
    }));
    setEmails(data);
  };

  const headers = [
    { display: t('email.email'), value: 'email', width: '100%' },
    { display: t('delete.delete'), type: 'iconButton', value: 'delete', icon: 'Delete' },
  ];

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = async (email) => {
    await api(
      formatRoute('/api/admin/emailLandingPage', null, {
        email,
      }),
      {
        method: 'DELETE',
      }
    );
    getEmails();
  };

  useEffect(() => {
    getEmails();
  }, []);

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
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
      const res = await api(`/api/admin/emailLandingPage`, {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === NUMBER_STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('email.email_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        getEmails();
        onClose();
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
    },
  });

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'email',
    },
  ];

  return (
    <Paper>
      <CardContent>
        <Table filter data={emails} headers={headers} title={t('landingPage.emails')} />
        <Button
          style={{ margin: '8px' }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t('add.add_email')}
        </Button>
      </CardContent>
      <FormDialog
        title={t('add.add_email')}
        open={open}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
    </Paper>
  );
}
