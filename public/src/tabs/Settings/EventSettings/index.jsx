import React, { useEffect, useContext } from 'react';

import { Paper, Card } from '../../../components/Custom';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import { CARD_TYPE_ENUM, REJECTION_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import moment from 'moment';
import styles from './EventSettings.module.css';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import { formatRoute, formatDate } from '../../../../src/utils/stringFormats';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../common/errors';

export default function EventSettings() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const getInfos = async () => {
    if (eventId) {
      const { data } = await api(
        formatRoute('/api/entity/event', null, {
          eventId,
        })
      );
      let start = data.start_date;
      if (start) {
        start = new Date(data.start_date);
      }
      let end = data.end_date;
      if (end) {
        end = new Date(data.end_date);
      }
      formik.setFieldValue('maximumSpots', data.maximum_spots || 0);
      formik.setFieldValue('startDate', formatDate(moment.parseZone(start), 'YYYY-MM-DD'));
      formik.setFieldValue('startTime', formatDate(moment.parseZone(start), 'HH:mm'));
      formik.setFieldValue('endDate', formatDate(moment.parseZone(end), 'YYYY-MM-DD'));
      formik.setFieldValue('endTime', formatDate(moment.parseZone(end), 'HH:mm'));
    }
  };
  useEffect(() => {
    getInfos();
  }, [eventId]);

  const getDate = (date, time, defaultTime) => {
    if (!date) {
      return null;
    }
    if (!time) {
      return `${date} ${defaultTime}`;
    }
    return `${date} ${time}`;
  };

  const validationSchema = yup.object().shape({
    maximumSpots: yup.number(t(ERROR_ENUM.VALUE_IS_INVALID)).min(0, t(ERROR_ENUM.VALUE_IS_INVALID)),
    startDate: yup.date(t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    startTime: yup.string(t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      maximumSpots: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { maximumSpots, startDate, startTime, endDate, endTime } = values;
      let start = getDate(startDate, startTime, '09:00');
      let end = getDate(endDate, endTime, '16:00');

      const res = await api(`/api/entity/updateEvent`, {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          maximumSpots,
          startDate: start,
          endDate: end,
        }),
      });
      if (res.data.reason) {
        if (res.data.reason === REJECTION_ENUM.TOO_MANY_TEAMS) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t(REJECTION_ENUM.TOO_MANY_TEAMS),
            severity: SEVERITY_ENUM.ERROR,
          });
        } else {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t(REJECTION_ENUM.LAST_TEAM_HIGHER_THAN_SPOTS),
            severity: SEVERITY_ENUM.ERROR,
          });
        }
      } else if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t(ERROR_ENUM.ERROR_OCCURED),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      } else {
        getInfos();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('informations_saved'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
      }
    },
  });

  return (
    <Paper title={t('event.event_settings')} className={styles.paper}>
      <Card items={{ formik }} type={CARD_TYPE_ENUM.EVENT_SETTINGS} />
    </Paper>
  );
}
