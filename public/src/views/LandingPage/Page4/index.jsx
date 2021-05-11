import React from 'react';

import styles from '../LandingPage.module.css';
import { CARD_TYPE_ENUM, PHOTO_ENUM } from '../../../../common/enums';
import MobileContainer from '../../../components/Custom/MobileContainer';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/Custom/Card';

export default function Page4() {
  const { t } = useTranslation();

  const austin = { name: 'Austin-Didier \n Tran', role: t('landingPage.roles.founder'), src: PHOTO_ENUM.AUSTIN };
  const team = [
    { name: 'Julien \n Bernat', role: t('landingPage.roles.vp_techno'), src: PHOTO_ENUM.JULIEN },
    { name: 'Émilie \n Oliver', role: t('landingPage.roles.comm'), src: PHOTO_ENUM.EMILIE },
    { name: 'Pierre-Etienne \n Morin', role: t('landingPage.roles.web_dev'), src: PHOTO_ENUM.PIERRE_ETIENNE },
    { name: 'Maxime \n Pellerin', role: t('landingPage.roles.web_dev'), src: PHOTO_ENUM.MAXIME },
    { name: 'Rémi \n Carrier-Desmarais', role: t('landingPage.roles.market_manager'), src: PHOTO_ENUM.REMI },
    { name: 'William \n Tran', role: t('landingPage.roles.market_strat'), src: PHOTO_ENUM.WILLIAM },
  ];

  return (
    <div className={styles.whiteContainer}>
      <MobileContainer>
        <div className={styles.block}>
          <div>
            <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
              {t('our_team')}
            </Typography>
            <div className={styles.divAustin}>
              <div className={styles.austin}>
                <Card
                  type={CARD_TYPE_ENUM.OUR_TEAM_MEMBER}
                  items={{
                    name: austin.name,
                    role: austin.role,
                    src: austin.src,
                  }}
                />
              </div>
            </div>
            <div className={styles.team}>
              {team.map((t) => (
                <Card
                  key={t.name}
                  type={CARD_TYPE_ENUM.OUR_TEAM_MEMBER}
                  items={{
                    name: t.name,
                    role: t.role,
                    src: t.src,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}
