import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, PHASE_TYPE_ENUM, SEVERITY_ENUM, NUMBER_STATUS_ENUM } from '../../../../../common/enums';
import * as yup from 'yup';
import { addPhase } from '../../../../actions/service/entity/post';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  update?: () => void;
}

const AddPhase: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onClose, update } = props;
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(isOpen);

  useEffect((): void => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = (): void => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    spots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    type: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      phase: '',
      spots: 0,
      type: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { phase, spots, type } = values;
      const status = await addPhase(phase, spots, eventId, type);
      if (status === NUMBER_STATUS_ENUM.ERROR || status === NUMBER_STATUS_ENUM.UNAUTHORIZED) {
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
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'type',
      label: t('type'),
      options: [
        {
          display: t('custom'),
          value: PHASE_TYPE_ENUM.CUSTOM,
        },
        {
          display: t('pool'),
          value: PHASE_TYPE_ENUM.POOL,
        },
      ],
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
};
export default AddPhase;
