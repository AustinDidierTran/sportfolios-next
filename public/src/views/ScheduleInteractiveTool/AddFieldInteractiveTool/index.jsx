import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import FormDialog from '../../../components/Custom/FormDialog';
import { ERROR_ENUM } from '../../../../common/errors';
import * as yup from 'yup';

export default function AddFieldInteractiveTool(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, addFieldToGrid } = props;

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    field: yup.string().max(25, t(ERROR_ENUM.VALUE_IS_TOO_LONG)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const sendToInteractiveTool = (values) => {
    const { field } = values;
    formik.resetForm();
    if (addFieldToGrid) {
      addFieldToGrid(field);
    }
  };

  const formik = useFormik({
    initialValues: {
      field: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
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
      namespace: 'field',
      id: 'field',
      type: 'text',
      label: t('field'),
    },
  ];

  return (
    <FormDialog
      open={isOpen}
      title={t('add_field')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
