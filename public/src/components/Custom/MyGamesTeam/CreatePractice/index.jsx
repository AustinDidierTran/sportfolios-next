import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { formatDate } from '../../../../utils/stringFormats';
import * as yup from 'yup';
import moment from 'moment';

export default function CreatePractice(props) {
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const {
    dispatch,
    state: { id: eventId, userInfo },
  } = useContext(Store);

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleChange = (event) => {
    let newTime = moment().hour(event.substring(0, 2)).minutes(event.substring(3, 5)).add(2, 'hours').format('HH:mm');

    formik.setFieldValue('timeEnd', newTime);
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    date: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    timeStart: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    timeEnd: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      date: formatDate(moment.parseZone(new Date().toLocaleString()), 'YYYY-MM-DD'),
      timeStart: '18:00',
      timeEnd: '20:00',
      addressFormatted: '',
      address: '',
      location: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {

      const { name, date, timeStart, timeEnd, addressFormatted, address, location } = values;

      let dateStart = `${date} ${timeStart}`;
      let dateEnd = `${date} ${timeEnd}`;
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
    },
  });

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      label: 'name',
      type: 'input',
    },
    {
      namespace: 'date',
      label: t('event.event_start_date'),
      type: 'date',
      shrink: true,
    },
    {
      namespace: 'timeStart',
      label: t('event.event_start_time'),
      type: 'time',
      shrink: true,
      onChange: handleChange,
    },
    {
      namespace: 'timeEnd',
      label: t('event.event_end_time'),
      type: 'time',
      shrink: true,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.ADDRESS,
      namespace: 'addressFormatted',
      language: userInfo.language,
      country: 'ca',
      addressChanged: () => {},
      placeholder: 'Enter an address',
      noValidate: true,
    },
    {
      namespace: 'location',
      label: 'Location',
      type: 'text',
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create.create_practice')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
