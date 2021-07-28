import React, { useState, useEffect, useContext } from 'react';

import api from '../../actions/api';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Custom/Button';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';
import AddTeam from './AddTeam';
import styles from './TabRosters.module.css';

const Rosters = dynamic(() => import('./Rosters'));

export default function TabRosters(props) {
  const { isEventAdmin } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { t } = useTranslation();
  const [rosters, setRosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(false);

  useEffect(() => {
    if (eventId) {
      getData();
    }
  }, [eventId]);

  const getRosters = async (eventId) => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsAcceptedInfos', null, {
        eventId,
      }),
      { method: 'GET' }
    );
    return data;
  };

  const getData = async () => {
    const rosters = await getRosters(eventId);
    const rostersUpdated = rosters.map((roster) => {
      const players = roster.players.filter((player) => !player.isSub);
      return { ...roster, players };
    });
    setRosters(rostersUpdated);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isEventAdmin ? (
        <Button size="small" variant="contained" endIcon="Add" onClick={() => setTeam(true)} className={styles.button}>
          {t('add.add_team')}
        </Button>
      ) : null}
      {!rosters.length ? (
        <Typography color="textSecondary" style={{ margin: '16px' }}>
          {t('there_is_no_rosters_for_this_event')}
        </Typography>
      ) : (
        <Rosters isEventAdmin={isEventAdmin} rosters={rosters} update={getData} />
      )}
      <AddTeam
        isOpen={team}
        onClose={() => {
          setTeam(false);
        }}
        update={getData}
      />
    </>
  );
}
