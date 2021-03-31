import React from 'react';
import Countdown from 'react-countdown';

import styles from './LaRuchePage.module.css';
import { LOGO_ENUM, PARTENERS_LOGO_ENUM } from '../../../../common/enums';
import { Typography } from '@material-ui/core';
// import Divider from '@material-ui/core/Divider';
// import MobileContainer from '../../../components/Custom/MobileContainer';
// import Button from '../../../components/Custom/Button';
// import Typography from '@material-ui/core/Typography';
// import { ROUTES, goTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
// import { AddGaEvent } from '../../../components/Custom/Analytics';

export default function LaRuchePage() {
  const { t } = useTranslation();

  const renderer = ({ days, hours, minutes, seconds }) => {
    // Render a countdown
    return (
      <span className={styles.countdown}>
        {days}
        {t('time_day')} {hours}
        {t('time_hour')} {minutes}
        {t('time_minute')} {seconds}
        {t('time_second')}
      </span>
    );
  };

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
            <img src={LOGO_ENUM.WHITE_LOGO_1024X1024} height="200px" width="200px" />
          </div>
          <div className={styles.countdownContainer}>
            <Typography variant="h4" className={styles.text}>
              {t('start_in')}
            </Typography>
            <Countdown date={new Date(2021, 3, 26)} renderer={renderer}></Countdown>
          </div>
        </div>
        <div>
          <Typography variant="h4" className={styles.text}>
            {t('in_partnership')}
          </Typography>
          <div className={styles.parteners}>
            <img src={PARTENERS_LOGO_ENUM.LA_RUCHE} height="48px" width="140px" className={styles.partenerLogo} />
            <Typography variant="h5" className={styles.text}>
              {t('and_lowerCased')}
            </Typography>
            <img src={PARTENERS_LOGO_ENUM.ESPACE_INC} height="48px" width="140px" className={styles.partenerLogo} />
          </div>
        </div>
      </div>
    </div>
  );
}
