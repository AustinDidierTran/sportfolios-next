import React from 'react';

import styles from './Players.module.css';
import { useTranslation } from 'react-i18next';
import PlayerCard from './PlayerCard';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

export default function Players(props) {
  const { t } = useTranslation();
  const { players } = props;

  if (!players) {
    return <></>;
  }
  return (
    <div className={styles.card}>
      <Typography className={styles.listTitle} variant="h6">
        {t('roster')}
      </Typography>
      <Divider className={styles.divider} />
      {
        <>
          {players.length ? (
            <div className={styles.player}>
              {players.map((player, index) => {
                return <PlayerCard index={index} player={player} key={player.id} />;
              })}
            </div>
          ) : (
            <Typography>{t('empty_roster')}</Typography>
          )}
        </>
      }
    </div>
  );
}
