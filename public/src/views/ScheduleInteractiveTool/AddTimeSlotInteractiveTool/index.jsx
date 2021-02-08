import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import FormDialog from '../../../components/Custom/FormDialog';
import { ERROR_ENUM } from '../../../../common/errors';
import moment from 'moment';
import * as yup from 'yup';

export default function AddTimeSlotInteractiveTool(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, addTimeslotToGrid } = props;

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    time: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    date: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const sendToInteractiveTool = (values) => {
    const { date, time } = values;
    const realDate = new Date(`${date} ${time}`).getTime();
    if (addTimeslotToGrid) {
      addTimeslotToGrid(realDate);
    }
  };

  const formik = useFormik({
    initialValues: {
      time: '09:00',
      date: moment().format('YYYY-MM-DD'),
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: sendToInteractiveTool,
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'default',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'date',
      id: 'date',
      type: 'date',
    },
    {
      namespace: 'time',
      id: 'time',
      type: 'time',
    },
  ];

  return (
    <FormDialog
      open={isOpen}
      title={t('add_time_slot')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
