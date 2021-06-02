import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import Paper from '../../components/Custom/Paper';
import { Store } from '../../Store';
import { formatRoute } from '../../utils/stringFormats';
import Players from './Players';

export default function TabTeamRosters() {
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/players', null, {
        teamId,
      })
    );
    setPlayers(data);
  };

  return (
    <Paper title={t('players')}>
      <Players players={players} />
    </Paper>
  );
}
