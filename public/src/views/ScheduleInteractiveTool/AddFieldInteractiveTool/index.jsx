import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import FormDialog from '../../../components/Custom/FormDialog';
import { ERROR_ENUM } from '../../../../common/errors';

export default function AddFieldInteractiveTool(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, addFieldToGrid } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = (values) => {
    const { field } = values;
    const errors = {};
    if (!field.length) {
      errors.field = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (field.length > 64) {
      formik.setFieldValue('field', field.slice(0, 64));
    }
    return errors;
  };

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
    validate,
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
      open={open}
      title={t('add_field')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
