import React, { useState, useMemo, useContext } from 'react';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formatIntervalDate, formatDate } from '../../../utils/stringFormats';
import styles from './BannerEvent.module.css';
import Typography from '@material-ui/core/Typography';
import { Store, SCREENSIZE_ENUM } from '../../../Store';
import Paper from '@material-ui/core/Paper';

export default function BannerEvent(props) {
  const { basicInfos, onClickMainButton, onClickSecondButton, eventInfo } = props;
  const { t } = useTranslation();
  const {
    state: { screenSize },
  } = useContext(Store);

  const fontVariant = useMemo(() => {
    return screenSize !== SCREENSIZE_ENUM.xs ? 'subtitle1' : 'caption';
  }, [screenSize]);

  const Registration = () => {
    if (!Array.isArray(eventInfo.options) || eventInfo.options.length < 1) {
      return <Typography variant="subtitle1" component="p"></Typography>;
    }
    if (eventInfo.isLate) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('register.registrations_ended')}&nbsp;{formatDate(moment(eventInfo.registrationEnd))}
        </Typography>
      );
    }
    if (eventInfo.isEarly) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('register.registrations_open_and_end_on', {
            openDate: formatDate(moment(eventInfo.registrationStart)),
            endDate: formatDate(moment(eventInfo.registrationEnd)),
          })}
        </Typography>
      );
    }
    if (eventInfo.remainingSpots < 1) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('event.event_is_full')}
        </Typography>
      );
    }
    return (
      <div>
        <Typography display={screenSize !== SCREENSIZE_ENUM.xs ? 'inline' : 'block'} variant={fontVariant}>
          {t('register.registrations_ends_on')}&nbsp;
          {formatDate(moment(eventInfo.registrationEnd))}
        </Typography>
        <Typography
          display={screenSize !== SCREENSIZE_ENUM.xs ? 'inline' : 'block'}
          variant={fontVariant}
          color="error"
        >
          &nbsp;({eventInfo.remainingSpots}&nbsp;
          {t('remaining_spots')})
        </Typography>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.divBannerHeader}>
        {screenSize !== SCREENSIZE_ENUM.xs && (
          <div className={styles.divBannerDate}>
            <div className={styles.date}>
              <Paper>
                <Typography className={styles.dateBorder} noWrap="true" variant="h3">
                  {moment(eventInfo.startDate || '0').format('DD')}
                </Typography>
              </Paper>
            </div>
          </div>
        )}
        <div className={styles.divBannerImage}>
          <img
            src={
              basicInfos.photoUrl ||
              'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73'
            }
            className={styles.bannerImage}
          />
        </div>
      </div>

      <div className={styles.divInfo}>
        <div className={styles.displayFlex}>
          <Typography variant={fontVariant} color="error">
            {eventInfo.startDate
              ? formatIntervalDate(moment(eventInfo.startDate), moment(eventInfo.endDate))
              : t('date_comming_soon')}
          </Typography>
          <Typography variant={fontVariant} color="error">
            &nbsp; - &nbsp;{eventInfo.location || 'Sherbrooke'}
          </Typography>
        </div>
        <Typography variant="h3">{eventInfo.name}</Typography>
        <Registration />
        {!eventInfo.isLate && !eventInfo.isEarly && (
          <div className={styles.buttonSignup}>
            <CustomButton onClick={onClickMainButton}>{t('register.register_event')}</CustomButton>
          </div>
        )}
      </div>
    </div>
  );
}
