import React from 'react';

import styles from '../LandingPage.module.css';
import { LOGO_ENUM } from '../../../../common/enums';
import Divider from '@material-ui/core/Divider';
import MobileContainer from '../../../components/Custom/MobileContainer';
import Button from '../../../components/Custom/Button';
import Typography from '@material-ui/core/Typography';
import { ROUTES, goTo } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { AddGaEvent } from '../../../components/Custom/Analytics';

export default function Page1() {
  const { t } = useTranslation();

  return (
    <div className={styles.whiteContainer}>
      <MobileContainer>
        <div className={styles.block}>
          <div className={styles.logo}>
            <img src={LOGO_ENUM.LOGO_1024X1024} height="200px" width="200px" />
          </div>
          <Divider variant="middle" className={styles.dividerRoot} />
          <div>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.1')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.2')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.3')}
            </Typography>
          </div>
          <Divider variant="middle" className={styles.dividerRoot} />
          <div>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.4')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.5')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.6')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.7')}
            </Typography>
            <Typography className={styles.text} variant="h4">
              {t('landingPage.presentation.8')}
            </Typography>
          </div>
          <Button
            onClick={() => {
              AddGaEvent({
                category: 'Landing page',
                action: 'User clicked to be redirected to login',
                label: 'landing_page_login',
              });
              goTo(ROUTES.login);
            }}
            className={styles.button}
          >
            {t('landingPage.presentation.9')}
          </Button>
        </div>
      </MobileContainer>
    </div>
  );
}
