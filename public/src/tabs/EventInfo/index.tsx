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
import moment from 'moment';
import styles from './EventInfo.module.css';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';
import { getEvent, getOptions, getRemainingSpots } from '../../actions/service/entity/get';
import { EventInfos, Options } from '../../../../typescript/types';

const Description = dynamic(() => import('./Description'));

const TabEventInfo: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const [options, setOptions] = useState<Options[]>();
  const [event, setEvent] = useState<EventInfos>();
  const [remainingSpots, setRemainingSpots] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async (): Promise<void> => {
    if (id) {
      getEvent(id).then(setEvent);
      getOptions(id).then(setOptions);
      getRemainingSpots(id).then(setRemainingSpots);
    }
    setIsLoading(false);
  };

  const isEarly = useMemo((): boolean => {
    if (!Array.isArray(options)) {
      return true;
    }
    return options.every((option) => moment(option.startTime) > moment());
  }, [options]);

  const isLate = useMemo((): boolean => {
    if (!Array.isArray(options)) {
      return true;
    }
    return options.every((option) => moment(option.endTime).add(24, 'hours') < moment());
  }, [options]);

  const RegistrationStart = useMemo((): boolean | string => {
    if (!Array.isArray(options)) {
      return true;
    }
    const startsDate = options.map((option) => moment(option.startTime));
    return formatDate(moment.min(startsDate));
  }, [options]);

  const registrationEnd = useMemo((): boolean | string => {
    if (!Array.isArray(options)) {
      return true;
    }
    const endsDate = options.map((option) => moment(option.endTime));
    return formatDate(moment.max(endsDate));
  }, [options]);

  const color =
    useMemo((): 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'initial' | 'error' => {
      if (remainingSpots <= Math.ceil(event.maximumSpots * 0.2)) {
        return 'secondary';
      }
      return 'textSecondary';
    }, [remainingSpots]);

  const isFull = useMemo((): boolean => {
    return remainingSpots && remainingSpots < 1;
  }, [remainingSpots]);

  const hasNoLimit = useMemo((): boolean => {
    return !remainingSpots;
  }, [remainingSpots]);

  const canRegister = useMemo((): boolean => {
    if (!Array.isArray(options) || options.length < 1 || isFull || isLate || isEarly) {
      return false;
    }
    return true;
  }, [isFull, options, isLate, isEarly, hasNoLimit]);

  const getDate = (): string => {
    return formatIntervalDate(moment(event.startDate), moment(event.endDate));
  };

  const Problems = (): any => {
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
            {isFull || hasNoLimit ? (
              <></>
            ) : (
              <Typography variant="body2" component="p" color={color}>
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
};
export default TabEventInfo;
