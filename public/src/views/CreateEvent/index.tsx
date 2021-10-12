import React, { useEffect, useState } from 'react';
import { EVENT_TYPE, GLOBAL_ENUM, REQUEST_STATUS_ENUM, TABS_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { formatDate, formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import CustomPaper from '../../components/Custom/Paper';
import styles from './CreateEvent.module.css';
import CardContent from '@material-ui/core/CardContent';
import { useFormik } from 'formik';
import moment from 'moment';
import { Avatar, CheckBox, Select, TextField } from '../../components/Custom';
import { getEntityOwned } from '../../actions/service/entity/get';
import ImagesList from '../../components/Custom/ImageSelection';
import { CardActions } from '@material-ui/core';
import CustomButton from '../../components/Custom/Button';
import * as yup from 'yup';
import { ERROR_ENUM } from '../../../common/errors';
import * as eventService from '../../actions/service/event/index';
import { goTo, ROUTES } from '../../actions/goTo';

interface IOption {
  value: string;
  display: string;
}

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

const CreateEvent: React.FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_event'));
  }, []);

  const [creatorOptions, setCreatorOptions] = useState<IOption[]>([]);

  useEffect(() => {
    getEntityOwned(Number(GLOBAL_ENUM.ORGANIZATION)).then((data) => {
      setCreatorOptions(
        data.map((d) => ({
          value: d.id,
          display: d.name,
        }))
      );
    });
  }, []);

  const eventTypeOptions = [
    { labelKey: 'team_league', value: EVENT_TYPE.TEAM_LEAGUE },
    { labelKey: 'pick_up', value: EVENT_TYPE.PICK_UP_LEAGUE },
    { labelKey: 'team_tournament', value: EVENT_TYPE.TEAM_TOURNAMENT },
    { labelKey: 'game', value: EVENT_TYPE.GAME },
  ];

  const validationSchema = yup.object().shape({
    creator: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    name: yup.string().max(64, t('invalid.invalid_64_length')).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    maximumSpots: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    photoUrl: yup.string().test('validate', (): boolean => {
      return formik.values.photoUrl != '';
    }),
    startDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    startTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formatToValidDate = (date: string, time: string) => {
    const formatted = `${date} ${time}`;

    if (!moment(formatted).isValid()) {
      return null;
    }

    return formatted;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      creator: '',
      maximumSpots: 16,
      hasSpotLimit: false,
      ticketLimit: 250,
      startDate: formatDate(moment.parseZone(new Date().toLocaleString()), 'YYYY-MM-DD'),
      startTime: '09:00',
      endDate: '',
      endTime: '',
      eventType: null,
      photoUrl: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const {
        name,
        creator,
        maximumSpots,
        hasSpotLimit,
        ticketLimit,
        startDate,
        startTime,
        endDate,
        endTime,
        eventType,
        photoUrl,
      } = values;

      const start = formatToValidDate(startDate, startTime);
      const end = formatToValidDate(endDate, endTime);
      const maximum = hasSpotLimit ? maximumSpots : null;

      const { id, status } = await eventService.create({
        name,
        creator,
        maximumSpots: maximum,
        ticketLimit: eventType === EVENT_TYPE.GAME ? ticketLimit : null,
        start,
        end,
        eventType,
        photoUrl,
      });

      // [UI improvement]: Error handling could be better...
      if (status !== REQUEST_STATUS_ENUM.SUCCESS) {
        formik.setFieldError('name', t('something_went_wrong'));
        return;
      }

      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.SETTINGS });
    },
  });

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <IgContainer>
      <CustomPaper title={t('create.create_event')} className={styles.paper}>
        <CardContent>
          <div className={styles.eventTypeContainer}>
            {eventTypeOptions.map((eventTypeOption, index) => (
              <div
                key={index}
                className={
                  formik.values.eventType === eventTypeOption.value
                    ? `${styles.eventType} ${styles.selected}`
                    : styles.eventType
                }
                onClick={() => formik.setFieldValue('eventType', eventTypeOption.value)}
              >
                <h3>{t(`event.${eventTypeOption.labelKey}.title`)}</h3>
                <p>{t(`event.${eventTypeOption.labelKey}.description`)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </CustomPaper>
      <CustomPaper title={t('create.additional_informations')} className={styles.paper}>
        <CardContent>
          {!formik.values.eventType ? (
            <p>{t('create.waiting_for_type')}</p>
          ) : formik.values.eventType === EVENT_TYPE.GAME ? (
            <>
              <TextField formik={formik} fullWidth namespace="name" label={t('name')} />
              <TextField
                formik={formik}
                fullWidth
                namespace="ticketLimit"
                label={t('event.ticket_limit')}
                type="number"
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="startDate"
                type="date"
                label={t('event.event_start_date')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="startTime"
                type="time"
                label={t('event.event_start_time')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="endDate"
                type="date"
                label={t('event.event_end_date')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="endTime"
                type="time"
                label={t('event.event_end_time')}
                InputLabelProps={{ shrink: true }}
              />
              <Select formik={formik} namespace="creator" label={t('create.create_as')} options={creatorOptions} />
              <Avatar namespace="photoUrl" photoUrl={formik.values.photoUrl} size="lg" />
              <ImagesList formik={formik} hasNoImage={Boolean(!formik.values.photoUrl)} />
              <CardActions style={{ marginTop: '1rem' }}>
                <CustomButton
                  size="small"
                  color="secondary"
                  variant="contained"
                  endIcon="Close"
                  style={{ marginLeft: 'auto' }}
                  disabled={formik.isSubmitting}
                >
                  {t('cancel')}
                </CustomButton>
                <CustomButton
                  size="small"
                  color="primary"
                  variant="contained"
                  endIcon="Check"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {t('create.create_event')}
                </CustomButton>
              </CardActions>
            </>
          ) : (
            <>
              <TextField formik={formik} fullWidth namespace="name" label={t('name')} />
              <CheckBox formik={formik} namespace="hasSpotLimit" label={t('set_limit_of_spots')} />
              {formik.values.hasSpotLimit ? (
                <TextField
                  formik={formik}
                  fullWidth
                  namespace="maximumSpots"
                  label={t('maximum_spots')}
                  type="number"
                />
              ) : (
                <></>
              )}
              <TextField
                formik={formik}
                fullWidth
                namespace="startDate"
                type="date"
                label={t('event.event_start_date')}
                shrink
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="startTime"
                type="time"
                label={t('event.event_start_time')}
                shrink
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="endDate"
                type="date"
                label={t('event.event_end_date')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                formik={formik}
                fullWidth
                namespace="endTime"
                type="time"
                label={t('event.event_end_time')}
                InputLabelProps={{ shrink: true }}
              />
              <Select formik={formik} namespace="creator" label={t('create.create_as')} options={creatorOptions} />
              <Avatar namespace="photoUrl" photoUrl={formik.values.photoUrl} size="lg" />
              <ImagesList formik={formik} hasNoImage={Boolean(!formik.values.photoUrl)} />
              <CardActions style={{ marginTop: '1rem' }}>
                <CustomButton
                  size="small"
                  color="secondary"
                  variant="contained"
                  endIcon="Close"
                  style={{ marginLeft: 'auto' }}
                  disabled={formik.isSubmitting}
                >
                  {t('cancel')}
                </CustomButton>
                <CustomButton
                  size="small"
                  color="primary"
                  variant="contained"
                  endIcon="Check"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {t('create.create_event')}
                </CustomButton>
              </CardActions>
            </>
          )}
        </CardContent>
      </CustomPaper>
    </IgContainer>
  );

  return <EntityCreate type={GLOBAL_ENUM.EVENT} />;
};
export default CreateEvent;
