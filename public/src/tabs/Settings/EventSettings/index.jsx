import React, { useEffect, useState, useContext } from 'react';

import { Paper, Card } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { CARD_TYPE_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
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
    maximumSpots: yup.number().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)).positive(t(ERROR_ENUM.VALUE_IS_INVALID)),
    eventStart: yup.date('allo').required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    eventEnd: yup.date('allo').required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
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
      console.log({ values });
      const { maximumSpots, eventStart, eventEnd } = values;
      const res = await api(`/api/entity/updateEvent`, {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          maximumSpots,
          eventStart,
          eventEnd,
        }),
      });
      console.log({ res });
      getInfos();
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('informations_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    },
  });
  console.log({ errors: formik.errors });
  const fields = [
    {
      namespace: 'maximumSpots',
      label: t('maximum_spots'),
      type: 'number',
    },
    {
      namespace: 'startDate',
      helperText: t('event_start'),
      type: 'date',
    },
    {
      namespace: 'endDate',
      helperText: t('event_end'),
      type: 'date',
    },
  ];

  return (
    <Paper title={t('event_settings')} className={styles.paper}>
      <Card items={{ fields, formik }} type={CARD_TYPE_ENUM.EVENT_SETTINGS} />
    </Paper>
  );
}
