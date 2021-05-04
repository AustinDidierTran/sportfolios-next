import React from 'react';

import styles from './WhatIsSportfolios.module.css';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import MobileContainer from '../../../components/Custom/MobileContainer';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function WhatIsSportfolios() {
  const { t } = useTranslation();
  const [width] = useWindowSize();

  return (
    <div className={styles.container}>
      <div className={styles.layer}>
        <MobileContainer>
          <div className={styles.block}>
            <img
              style={{ marginTop: '8vh' }}
              src="https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-0fje3-2850fc27-60b3-4508-93d1-56b454c9edf0"
              height={width < MOBILE_WIDTH ? '100px' : '150px'}
              width={width < MOBILE_WIDTH ? '100px' : '150px'}
            />
            <Typography variant="h2" className={styles.text}>
              {t('landingPage.whatIs.1')}
            </Typography>
            <Typography variant="h3" color="primary" className={styles.text2}>
              {t('landingPage.whatIs.2')}
            </Typography>
            <Typography variant="h4" className={styles.text2}>
              {t('landingPage.whatIs.3')}
            </Typography>
            <img
              src="https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-3w2qd-2850fc27-60b3-4508-93d1-56b454c9edf0"
              height={width < MOBILE_WIDTH ? '282px' : '350px'}
              width={width < MOBILE_WIDTH ? '400px' : '500px'}
              style={{ marginBottom: '32px' }}
            />
            <Typography variant="h2" className={styles.text3}>
              {t('landingPage.whatIs.4')}
            </Typography>
            <img
              style={{ marginBottom: '8vh' }}
              src="https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-vgpzt-2850fc27-60b3-4508-93d1-56b454c9edf0"
              height={width < MOBILE_WIDTH ? '138px' : '172px'}
              width={width < MOBILE_WIDTH ? '400px' : '500px'}
            />
          </div>
        </MobileContainer>
      </div>
    </div>
  );
}
