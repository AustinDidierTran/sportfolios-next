import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { FormDialog } from '../../../components/Custom';
import { ERROR_ENUM } from '../../../../common/errors';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';

export default function EditPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, currentSpots, update } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  useEffect(() => {
    if (currentSpots) {
      formik.setFieldValue('spots', currentSpots);
    }
  }, [currentSpots]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    spots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      spots: 0,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { spots } = values;
      const res = await api('/api/entity/updatePhase', {
        method: 'PUT',
        body: JSON.stringify({
          phaseId,
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
        message: t('phase_updated'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      update();
      handleClose();
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
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'spots',
      id: 'spots',
      label: t('maximum_spots'),
      type: 'number',
    },
  ];

  return (
    <FormDialog
      open={isOpen}
      title={t('edit.edit_phase')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
