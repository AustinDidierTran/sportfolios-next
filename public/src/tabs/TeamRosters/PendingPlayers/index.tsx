import React, { useContext, useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import { Store } from '../../../Store';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import { PendingPlayer as PendingPlayerType, Person, Player } from '../../../../../typescript/types';
import { getTeamPlayersPending } from '../../../actions/service/entity/get';
import PendingPlayer from './PendingPlayer';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

interface IProps {
  role: number;
}

const PendingPlayers: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { role } = props;

  const {
    state: { id: teamId, userInfo },
  } = useContext(Store);

  useEffect((): void => {
    if (teamId && userInfo.persons) {
      getPlayersPending();
    }
  }, [teamId, userInfo]);

  const [players, setPlayers] = useState<PendingPlayerType[]>([]);

  const isAdmin = useMemo((): boolean => {
    return role === ENTITIES_ROLE_ENUM.ADMIN || role === ENTITIES_ROLE_ENUM.EDITOR;
  }, [role]);

  const getPlayersPending = async (): Promise<void> => {
    const players = await getTeamPlayersPending(teamId);
    if (!isAdmin) {
      const ids = userInfo.persons.map((p: Player) => p.personId);
      const filtered = players.filter((p: Player) => ids.includes(p.id));
      setPlayers(filtered);
    } else {
      setPlayers(players);
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
