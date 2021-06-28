import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  addFieldToGrid?: (data: any) => void;
}

const AddField: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onClose, addFieldToGrid } = props;
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect((): void => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = (): void => {
    formik.resetForm();
    onClose();
  };

  const validate = (values: { field: string }): { field?: string } => {
    const { field } = values;
    const errors: { field?: string } = {};
    if (!field.length) {
      errors.field = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (field.length > 64) {
      formik.setFieldValue('field', field.slice(0, 64));
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      field: '',
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { field } = values;
      const { status, data } = await api('/api/entity/field', {
        method: 'POST',
        body: JSON.stringify({
          field,
          eventId,
        }),
      });

      resetForm();

      if (status === STATUS_ENUM.ERROR || status === STATUS_ENUM.UNAUTHORIZED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
        return;
      }

      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('field_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });

      // used in interactive tool
      if (addFieldToGrid) {
        addFieldToGrid(data);
      }
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'default',
    },
    {
      type: 'submit',
      name: t('add.add'),
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
      title={t('add.add_field')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
};
export default AddField;
