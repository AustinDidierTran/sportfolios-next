import React, { useState, useMemo, useEffect, useContext } from 'react';

import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import ContainerBottomFixed from '../../components/Custom/ContainerBottomFixed';
import ImageCard from '../../components/Custom/ImageCard';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';
import { formatIntervalDate, formatDate } from '../../utils/stringFormats';
import api from '../../actions/api';
import moment from 'moment';
import styles from './EventInfo.module.css';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';

const Description = dynamic(() => import('./Description'));

const getEvent = async (eventId) => {
  const { data } = await api(formatRoute('/api/entity/eventInfos', null, { id: eventId }), { method: 'GET' });
  return data;
};

const getOptions = async (eventId) => {
  const { data } = await api(formatRoute('/api/entity/options', null, { eventId }), { method: 'GET' });
  return data;
};

const getRemainingSpots = async (id) => {
  const { data } = await api(formatRoute('/api/entity/remainingSpots', null, { id }), { method: 'GET' });
  return data;
};

export default function TabEventInfo() {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const [options, setOptions] = useState([]);
  const [event, setEvent] = useState({});
  const [remainingSpots, setRemainingSpots] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    if (id) {
      const event = await getEvent(id);
      setEvent(event);

      const options = await getOptions(id);
      setOptions(options);

      const remainingSpots = await getRemainingSpots(id);
      setRemainingSpots(remainingSpots);
    }
    setIsLoading(false);
  };

  const isEarly = useMemo(() => {
    if (!Array.isArray(options)) {
      return true;
    }
    return options.every((option) => moment(option.startTime) > moment());
  }, [options]);

  const isLate = useMemo(() => {
    if (!Array.isArray(options)) {
      return true;
    }
    return options.every((option) => moment(option.endTime).add(24, 'hours') < moment());
  }, [options]);

  const RegistrationStart = useMemo(() => {
    if (!Array.isArray(options)) {
      return true;
    }
    const startsDate = options.map((option) => moment(option.startTime));
    return formatDate(moment.min(startsDate));
  }, [options]);

  const registrationEnd = useMemo(() => {
    if (!Array.isArray(options)) {
      return true;
    }
    const endsDate = options.map((option) => moment(option.endTime));
    return formatDate(moment.max(endsDate));
  }, [options]);

  const color = useMemo(() => {
    if (remainingSpots <= Math.ceil(event.maximumSpots * 0.2)) {
      return 'secondary';
    }
    return 'textSecondary';
  }, [remainingSpots]);

  const isFull = useMemo(() => {
    return remainingSpots && remainingSpots < 1;
  }, [remainingSpots]);

  const hasNoLimit = useMemo(() => {
    return !remainingSpots;
  }, [remainingSpots]);

  const canRegister = useMemo(() => {
    if (!Array.isArray(options) || options.length < 1 || isFull || isLate || isEarly) {
      return false;
    }
    return true;
  }, [isFull, options, isLate, isEarly, hasNoLimit]);

  const getDate = () => {
    return formatIntervalDate(moment(event.startDate), moment(event.endDate));
  };

  const Problems = () => {
    if (!Array.isArray(options) || options.length < 1) {
      return (
        <Typography variant="body2" color="textSecondary" component="p">
          {t('register.registrations_closed_for_now')}
        </Typography>
      );
    }
    if (isLate) {
      return (
        <Typography variant="body2" color="textSecondary" component="p">
          {t('register.registrations_ended')}&nbsp;{registrationEnd}
        </Typography>
      );
    }
    if (isEarly) {
      return (
        <>
          <Typography variant="body2" color="textSecondary" component="p">
            {t('register.registrations_open_on')}&nbsp;{RegistrationStart}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {t('register.registrations_ends_on')}&nbsp;
            {registrationEnd}
          </Typography>
        </>
      );
    }
    if (hasNoLimit) {
      return (
        <Typography variant="body2" color="textSecondary" component="p">
          {t('event.event_is_open')}&nbsp;
          {registrationEnd}
        </Typography>
      );
    } else if (isFull) {
      return (
        <Typography variant="body2" color="textSecondary" component="p">
          {t('event.event_is_full')}
        </Typography>
      );
    }
    return (
      <Typography variant="body2" color="textSecondary" component="p">
        {t('register.registrations_ends_on')}&nbsp;
        {registrationEnd}
      </Typography>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={canRegister ? styles.event : styles.event1}>
      <div className={styles.infos}>
        <Paper className={styles.paper}>
          <ImageCard
            onClick={() => goTo(ROUTES.entity, { id })}
            photoUrl={event.photoUrl || ''}
            className={styles.media}
          />
          <CardContent className={styles.content}>
            <Typography className={styles.name}>{event.name}</Typography>
            {event.quickDescription ? (
              <Typography className={styles.quickDescription} variant="body2" color="textSecondary" component="p">
                {decodeURIComponent(event.quickDescription)}
              </Typography>
            ) : (
              <></>
            )}
            <Typography variant="body2" color="textSecondary" component="p">
              {getDate()}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {event.location || 'Sherbrooke'}
            </Typography>
            {isFull || hasNoLimit ? (
              <></>
            ) : (
              <Typography variant="body2" color={color} component="p">
                {remainingSpots}&nbsp;
                {t('places_left')}
              </Typography>
            )}
            <Problems />
          </CardContent>
        </Paper>
      </div>
      <div className={styles.description}>
        <Description description={event.description} />
      </div>
      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          {canRegister ? (
            <Button
              size="small"
              variant="contained"
              endIcon="SupervisedUserCircle"
              style={{ margin: '8px' }}
              onClick={goToRegistration}
              className={styles.button}
              hidden
            >
              {t('register.register')}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </ContainerBottomFixed>
    </div>
  );
}
