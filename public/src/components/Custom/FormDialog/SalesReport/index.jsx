import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM, REPORT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import moment from 'moment';
import { createReport } from '../../../../actions/service/report';

export default function SalesReport(props) {
  const { open: openProps, onClose, handleCreated } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (values) => {
    const { date } = values;
    const errors = {};
    if (!date) {
      errors.date = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      date: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const { date } = values;
      const res = await createReport(REPORT_TYPE_ENUM.SALES, entityId, date);

      if (res.status === REQUEST_STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('report.report_created'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        onClose();
        handleCreated();
      }
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('date', moment().format('YYYY-MM-DD'));
    setOpen(openProps);
  }, [openProps]);

  const fields = [
    {
      namespace: 'date',
      label: t('date'),
      type: 'date',
      shrink: true,
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
      disabled: isSubmitting,
    },
    {
      type: 'submit',
      name: t('create.create'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('choose.choose_date')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
