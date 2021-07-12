import React, { useContext, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import { Store } from '../../../Store';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import { PendingPlayer as PendingPlayerType } from '../../../../../typescript/types';
import { getTeamPlayersPending, getMyTeamPlayersRequest } from '../../../actions/service/entity/get';
import PendingPlayer from './PendingPlayer';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

interface IProps {
  role: number;
}

const PendingPlayers: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { role } = props;

  const {
    state: { id: teamId },
  } = useContext(Store);

  const isAdmin = useMemo((): boolean => {
    return role === ENTITIES_ROLE_ENUM.ADMIN || role === ENTITIES_ROLE_ENUM.EDITOR;
  }, [role]);

  useEffect((): void => {
    if (teamId) {
      getPlayersPending();
    }
  }, [teamId, isAdmin]);

  const [players, setPlayers] = useState<PendingPlayerType[]>([]);

  const getPlayersPending = (): void => {
    if (isAdmin) {
      getTeamPlayersPending(teamId).then(setPlayers);
    } else {
      getMyTeamPlayersRequest(teamId).then(setPlayers);
    }
  };

  return (
    <>
      {players.length ? (
        <Paper title={t('players_request')} className={styles.paper}>
          <List className={styles.list}>
            {players.map((player, index) => (
              <PendingPlayer
                isAdmin={isAdmin}
                key={player.id}
                teamId={teamId}
                player={player}
                index={index}
                update={getPlayersPending}
              />
            ))}
          </List>
        </Paper>
      ) : null}
    </>
  );
};

export default PendingPlayers;
