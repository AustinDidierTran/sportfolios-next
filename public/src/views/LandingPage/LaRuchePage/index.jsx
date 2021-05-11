import React from 'react';
import Countdown from 'react-countdown';

import styles from './LaRuchePage.module.css';
import { LOGO_ENUM, PARTENERS_LOGO_ENUM } from '../../../../common/enums';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function LaRuchePage() {
  const { t } = useTranslation();
  const [width] = useWindowSize();

  return (
    <div className={styles.page}>
      <div className={styles.layer}>
        <div className={styles.titleContainer}>
          <Typography variant="h2" font className={styles.title}>
            {t('campaign')}
          </Typography>
          <div className={styles.logo}>
            <img
              src={LOGO_ENUM.WHITE_LOGO_1024X1024}
              height={width < MOBILE_WIDTH ? '200px' : '300px'}
              width={width < MOBILE_WIDTH ? '200px' : '300px'}
            />
          </div>
        </div>
        <div className={styles.pageContent}>
          <div className={styles.countdownContainer}>
            <Typography variant="h4" className={styles.text}>
              {t('start_in')}
            </Typography>
            <Countdown
              className={styles.count}
              date={new Date(2021, 4, 17)}
              renderer={(props) => (
                <span className={styles.countdown}>
                  {[
                    { time: props.formatted.days, key: 'time_day' },
                    { time: props.formatted.hours, key: 'time_hour' },
                    { time: props.formatted.minutes, key: 'time_minute' },
                    { time: props.formatted.seconds, key: 'time_second' },
                  ].map((count) => (
                    <React.Fragment key={count.key}>
                      <div className={styles.countdownContainer}>
                        <div className={styles.countdownBubble}>{count.time}</div>
                        <span className={styles.countdownLabel}>{t(count.key)}</span>
                      </div>
                    </React.Fragment>
                  ))}
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
              height={width < MOBILE_WIDTH ? '48px' : '112px'}
              width={width < MOBILE_WIDTH ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
            <Typography variant="h5" className={styles.text}>
              {t('and_lowerCased')}
            </Typography>
            <img
              src={PARTENERS_LOGO_ENUM.ESPACE_INC}
              height={width < MOBILE_WIDTH ? '48px' : '112px'}
              width={width < MOBILE_WIDTH ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
