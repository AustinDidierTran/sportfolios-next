import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import { Store } from '../../../Store';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import { PendingPlayer as PendingPlayerType } from '../../../../../typescript/types';
import { getTeamPlayersPending } from '../../../actions/service/entity';
import PendingPlayer from './PendingPlayer';

const PendingPlayers: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect((): void => {
    if (teamId) {
      getPlayersPending();
    }
  }, [teamId]);

  const [players, setPlayers] = useState<PendingPlayerType[]>([]);

  const getPlayersPending = async () => {
    getTeamPlayersPending(teamId).then(setPlayers);
  };

  return (
    <>
      {players.length ? (
        <Paper title={t('players_request')} className={styles.paper}>
          <List className={styles.list}>
            {players.map((player, index) => (
              <PendingPlayer key={player.id} teamId={teamId} player={player} index={index} update={getPlayersPending} />
            ))}
          </List>
        </Paper>
      ) : null}
    </>
  );
};

export default PendingPlayers;
