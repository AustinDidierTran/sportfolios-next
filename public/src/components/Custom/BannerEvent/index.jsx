import React, { useState } from 'react';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';

import styles from './BannerEvent.module.css';
import Typography from '@material-ui/core/Typography';

export default function BannerEvent(props) {
  const { basicInfos, onClickMainButton, onClickSecondButton, eventInfo } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.divBannerHeader}>
        <div className={styles.divBannerDate}>
          <div className={styles.date}>
            <Typography noWrap="true" variant="h1">
              23
            </Typography>
          </div>
        </div>
        <div>
          <img src={basicInfos.photoUrl} className={styles.bannerImage} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <Typography color="textSecondary">23 mars au 24 mars 2021 -</Typography>
          <Typography color="textSecondary">- Sherbrooke</Typography>
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <Typography variant="h3">Tournois de soccer</Typography>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ justifyContent: 'center' }}>
              <CustomButton onClick={onClickMainButton}>S'inscrire à l'évènement</CustomButton>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle1">Les inscriptions terminent le 16 avril 2021</Typography>
          <Typography color="error" variant="subtitle1">
            (1 places restantes)
          </Typography>
        </div>
      </div>
    </div>
  );
}
