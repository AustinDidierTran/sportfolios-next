import React from 'react';
import { useTranslation } from 'react-i18next';
import { PHOTO_ENUM } from '../../../../common/enums';

import styles from './Team.module.css';

const Team = (props) => {
  const { t } = useTranslation();
  const team = [
    {
      labelKey: 'austin',
      photoUrl: PHOTO_ENUM.AUSTIN,
    },
    {
      labelKey: 'emilie',
      photoUrl: PHOTO_ENUM.EMILIE,
    },
    {
      labelKey: 'julien',
      photoUrl: PHOTO_ENUM.JULIEN,
    },
    {
      labelKey: 'maxime',
      photoUrl: PHOTO_ENUM.MAXIME,
    },
    {
      labelKey: 'pierre-etienne',
      photoUrl: PHOTO_ENUM.PIERRE_ETIENNE,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>{t('landingPage.team.title')}</h1>
        <div className={styles.businessTeamContainer}>
          {team.map((m, index) => (
            <div className={styles.teamContainer}>
              <img className={styles.picture} src={m.photoUrl}></img>
              <div className={styles.moduleDescription}>
                <span className={styles.teamName}>{t(`landingPage.team.${m.labelKey}.name`)}</span>
                <br />
                <span className={styles.teamTitle}>{t(`landingPage.team.${m.labelKey}.title`)}</span>
                <p>{t(`landingPage.team.${m.labelKey}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
