import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useRouter } from 'next/router';
import * as yup from 'yup';

export default function AddTeamPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, update } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [open, setOpen] = useState(isOpen);

  console.log({ open });

  const validationSchema = yup.object().shape({
    team: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const getAvailableTeams = () => {
    //TODO getAvailableTeams
  };

  useEffect(() => {
    setOpen(isOpen);
    getAvailableTeams();
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      rosterId: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { roserId } = values;
      console.log({ rosterId });

      const { status, data } = await api('/api/entity/addTeamPhase', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          rosterId,
          initialPosition,
          eventId,
        }),
      });
      if (status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        onClose();
        resetForm();
      }
      update();
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: [],
      namespace: 'team',
      label: t('team'),
    },
  ];

  return (
    <FormDialog open={open} title={t('add_team')} buttons={buttons} fields={fields} formik={formik} onClose={onClose} />
  );
}
