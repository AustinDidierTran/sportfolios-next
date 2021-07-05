import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, NUMBER_STATUS_ENUM } from '../../../../../common/enums';
import moment from 'moment';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  addTimeslotToGrid?: (data: any, realDate: number) => void;
}

const AddTimeSlot: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onClose, addTimeslotToGrid } = props;
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

  const validate = (values: { time: string; date: string }): { time?: string; date?: string } => {
    const { date, time } = values;
    const errors: { time?: string; date?: string } = {};
    if (!time.length) {
      errors.time = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!date.length) {
      errors.date = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      time: '09:00',
      date: moment().format('YYYY-MM-DD'),
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { date, time } = values;
      const realDate = new Date(`${date} ${time}`).getTime();
      const { status, data } = await api('/api/entity/timeSlots', {
        method: 'POST',
        body: JSON.stringify({
          date: realDate,
          eventId,
        }),
      });

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
        message: t('time_slot_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });

      // used in interactive tool
      if (addTimeslotToGrid) {
        addTimeslotToGrid(data, realDate);
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
      open={open}
      title={t('add.add_time_slot')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
};
export default AddTimeSlot;
