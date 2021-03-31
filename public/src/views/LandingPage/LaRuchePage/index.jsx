import React from 'react';
import Countdown from 'react-countdown';

import styles from './LaRuchePage.module.css';
import { LOGO_ENUM, PARTENERS_LOGO_ENUM } from '../../../../common/enums';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function LaRuchePage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.layer}>
        <div className={styles.titleContainer}>
          <Typography variant="h2" font className={styles.title}>
            {t('campaign')}
          </Typography>
        </div>
        <div className={styles.pageContent}>
          <div className={styles.logo}>
            <img
              src={LOGO_ENUM.WHITE_LOGO_1024X1024}
              height={window.innerWidth < 600 ? '200px' : '400px'}
              width={window.innerWidth < 600 ? '200px' : '400px'}
            />
          </div>
          <div className={styles.countdownContainer}>
            <Typography variant="h4" className={styles.text}>
              {t('start_in')}
            </Typography>
            <Countdown
              className={styles.count}
              date={new Date(2021, 3, 26)}
              renderer={(props) => (
                <span className={styles.countdown}>
                  {props.formatted.days}
                  {t('time_day')}
                  {props.formatted.hours}
                  {t('time_hour')}
                  {props.formatted.minutes}
                  {t('time_minute')}
                  {props.formatted.seconds}
                  {t('time_second')}
                </span>
              )}
              zeroPadTime={2}
            ></Countdown>
          </div>
        </div>
        <div className={styles.partnersContainer}>
          <Typography variant="h4" className={styles.text}>
            {t('in_partnership')}
          </Typography>
          <div className={styles.partners}>
            <img
              src={PARTENERS_LOGO_ENUM.LA_RUCHE}
              height={window.innerWidth < 600 ? '48px' : '112px'}
              width={window.innerWidth < 600 ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
            <Typography variant="h5" className={styles.text}>
              {t('and_lowerCased')}
            </Typography>
            <img
              src={PARTENERS_LOGO_ENUM.ESPACE_INC}
              height={window.innerWidth < 600 ? '48px' : '112px'}
              width={window.innerWidth < 600 ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
