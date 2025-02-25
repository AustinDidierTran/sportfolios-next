import React, { useMemo } from 'react';

import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formatIntervalDate, formatDate } from '../../../utils/stringFormats';
import styles from './BannerEvent.module.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { Entity } from '../../../../../typescript/types';

interface IProps {
  adminView: boolean;
  onSwitch: () => void;
  isAdmin: boolean;
  onClickMainButton: () => void;
  eventInfo: any;
  basicInfos: Entity;
}

const BannerEvent: React.FunctionComponent<IProps> = (props) => {
  const { basicInfos, onClickMainButton, eventInfo, onSwitch, adminView, isAdmin } = props;
  const { t } = useTranslation();
  const [width] = useWindowSize();

  const fontVariant = useMemo(() => {
    return width > MOBILE_WIDTH ? 'subtitle1' : 'caption';
  }, [width]);

  const checkCanRegister = (): boolean => {
    return (
      !Array.isArray(eventInfo.options) ||
      eventInfo.options.length < 1 ||
      (eventInfo.remainingSpots < 1 && eventInfo.remainingSpots != null) ||
      eventInfo.isLate ||
      eventInfo.isEarly
    );
  };

  const canRegister: boolean = useMemo<boolean>(() => {
    return !checkCanRegister();
  }, [eventInfo]);

  const Registration = () => {
    if (!Array.isArray(eventInfo.options) || eventInfo.options.length < 1) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('register.registrations_closed_for_now')}
        </Typography>
      );
    }
    if (eventInfo.isLate) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('register.registrations_ended')}&nbsp;{formatDate(moment.utc(eventInfo.registrationEnd))}
        </Typography>
      );
    }
    if (eventInfo.isEarly) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('register.registrations_open_and_end_on', {
            openDate: formatDate(moment.utc(eventInfo.registrationStart)),
            endDate: formatDate(moment.utc(eventInfo.registrationEnd)),
          })}
        </Typography>
      );
    }
    if (eventInfo.remainingSpots === null) {
      return (
        <Typography display={width > MOBILE_WIDTH ? 'inline' : 'block'} variant={fontVariant}>
          {t('event.event_is_open')}&nbsp;
          {formatDate(moment.utc(eventInfo.registrationEnd))}&nbsp;
        </Typography>
      );
    } else if (eventInfo.remainingSpots < 1) {
      return (
        <Typography variant={fontVariant} component="p">
          {t('event.event_is_full')}
        </Typography>
      );
    }
    return (
      <div>
        <Typography display={width > MOBILE_WIDTH ? 'inline' : 'block'} variant={fontVariant}>
          {t('register.registrations_ends_on')}&nbsp;
          {formatDate(moment.utc(eventInfo.registrationEnd))}&nbsp;
        </Typography>
        <Typography display={width > MOBILE_WIDTH ? 'inline' : 'block'} variant={fontVariant} color="error">
          ({eventInfo.remainingSpots}&nbsp;
          {t('remaining_spots')})
        </Typography>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.divBannerHeader}>
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
      <div className={styles.rootInfo}>
        <div>
          {width > MOBILE_WIDTH && (
            <div className={styles.divBannerDate}>
              <div className={styles.date}>
                <Paper>
                  <Typography className={styles.dateBorder} noWrap variant="h3">
                    {moment.parseZone(eventInfo.startDate || '0').format('DD')}
                  </Typography>
                </Paper>
              </div>
            </div>
          )}
        </div>
        <div className={styles.divInfo}>
          <div className={styles.displayFlex}>
            <div className={styles.divDate}>
              <Typography variant={fontVariant} color="error">
                {eventInfo.startDate
                  ? formatIntervalDate(moment.parseZone(eventInfo.startDate), moment.parseZone(eventInfo.endDate))
                  : t('date_coming_soon')}
              </Typography>
              {eventInfo.location && (
                <Typography variant={fontVariant} color="error">
                  {` - ${eventInfo.location}`}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.displayFlex}>
            <Typography variant="h3">{eventInfo.name}</Typography>
          </div>
          <Registration />
        </div>
      </div>
      <>
        <Divider variant="middle" />
        <div className={styles.divIconButton}>
          {isAdmin && (
            <>
              {adminView ? (
                <CustomButton
                  className={styles.view}
                  startIcon="Autorenew"
                  color="secondary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('player_view')}
                </CustomButton>
              ) : (
                <CustomButton
                  className={styles.view}
                  startIcon="Autorenew"
                  color="primary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('admin_view')}
                </CustomButton>
              )}
            </>
          )}
          {canRegister && (
            <div className={styles.divIconSignup}>
              <CustomButton
                size="small"
                variant="contained"
                startIcon="Assignment"
                className={styles.iconSign}
                onClick={onClickMainButton}
                disableElevation
              >
                {t('register.register')}
              </CustomButton>
            </div>
          )}
        </div>
      </>
    </div>
  );
};
export default BannerEvent;
