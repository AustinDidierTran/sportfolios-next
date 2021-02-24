import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useRouter } from 'next/router';
import * as yup from 'yup';

export default function AddPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, update } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    spots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      phase: '',
      spots: 0,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { phase, spots } = values;
      const res = await api('/api/entity/phase', {
        method: 'POST',
        body: JSON.stringify({
          phase,
          spots,
          eventId,
        }),
      });

      if (res.status === STATUS_ENUM.ERROR || res.status === STATUS_ENUM.UNAUTHORIZED) {
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
        message: t('phase_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      update();
      formik.setFieldValue('phase', '');
    },
  });

  const buttons = [
    {
      onClick: handleClose,
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
      namespace: 'phase',
      id: 'phase',
      label: 'Phase',
      type: 'phase',
    },
    {
      namespace: 'spots',
      id: 'spots',
      label: t('maximum_spots'),
      type: 'number',
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create.create_a_phase')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
