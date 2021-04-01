import React from 'react';
import Countdown from 'react-countdown';

import styles from './LaRuchePage.module.css';
import { LOGO_ENUM, PARTENERS_LOGO_ENUM } from '../../../../common/enums';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Custom/Button';
import { AddGaEvent } from '../../../components/Custom/Analytics';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useWindowSize } from '../../../hooks/window';

export default function LaRuchePage() {
  const { t } = useTranslation();
  const [width] = useWindowSize();

  return (
    <div className={styles.page}>
      <div className={styles.layer}>
        <div className={styles.login}>
          <Button
            onClick={() => {
              AddGaEvent({
                category: 'Landing page',
                action: 'User clicked to be redirected to login',
                label: 'landing_page_login',
              });
              goTo(ROUTES.login);
            }}
          >
            {t('landingPage.presentation.9')}
          </Button>
        </div>
        <div className={styles.titleContainer}>
          <Typography variant="h2" font className={styles.title}>
            {t('campaign')}
          </Typography>
          <div className={styles.logo}>
            <img
              src={LOGO_ENUM.WHITE_LOGO_1024X1024}
              height={width < 600 ? '200px' : '300px'}
              width={width < 600 ? '200px' : '300px'}
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
              date={new Date(2021, 3, 26)}
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
              height={width < 600 ? '48px' : '112px'}
              width={width < 600 ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
            <Typography variant="h5" className={styles.text}>
              {t('and_lowerCased')}
            </Typography>
            <img
              src={PARTENERS_LOGO_ENUM.ESPACE_INC}
              height={width < 600 ? '48px' : '112px'}
              width={width < 600 ? '140px' : '320px'}
              className={styles.partnerLogo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
