import React, { useEffect, useState, useContext } from 'react';

import { Paper, Card } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { CARD_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import moment from 'moment';
import styles from './EventSettings.module.css';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../common/errors';

export default function EventSettings() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const getInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/event', null, {
        eventId,
      })
    );
    formik.setFieldValue('maximumSpots', data.maximum_spots || 0);
    formik.setFieldValue('startDate', moment(data.start_date).format('YYYY-MM-DD'));
    formik.setFieldValue('endDate', moment(data.end_date).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    getInfos();
  }, [eventId]);

  const validationSchema = yup.object().shape({
    maximumSpots: yup.number(t(ERROR_ENUM.VALUE_IS_INVALID)).min(0, t(ERROR_ENUM.VALUE_IS_INVALID)),
    eventStart: yup.date(t(ERROR_ENUM.VALUE_IS_INVALID)),
    eventEnd: yup.date(t(ERROR_ENUM.VALUE_IS_INVALID)),
  });

  const formik = useFormik({
    initialValues: {
      maximumSpots: '',
      startDate: '',
      endDate: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { maximumSpots, startDate: startDateProps, endDate: endDateProps } = values;
      let startDate = startDateProps;
      if (!moment(startDateProps).isValid()) {
        startDate = null;
      }
      let endDate = endDateProps;
      if (!moment(endDateProps).isValid()) {
        endDate = null;
      }
      const res = await api(`/api/entity/updateEvent`, {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          maximumSpots,
          startDate,
          endDate,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(ERROR_ENUM.ERROR_OCCURED),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      }
      getInfos();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('informations_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    },
  });

  const fields = [
    {
      namespace: 'maximumSpots',
      label: t('maximum_spots'),
      type: 'number',
    },
    {
      namespace: 'startDate',
      helperText: t('event.event_start'),
      type: 'date',
    },
    {
      namespace: 'endDate',
      helperText: t('event.event_end'),
      type: 'date',
    },
  ];

  return (
    <Paper title={t('event.event_settings')} className={styles.paper}>
      <Card items={{ fields, formik }} type={CARD_TYPE_ENUM.EVENT_SETTINGS} />
    </Paper>
  );
}
