import React, { useState, useEffect, useContext } from 'react';

import api from '../../actions/api';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/Custom';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';

const Rosters = dynamic(() => import('./Rosters'));

export default function TabRosters(props) {
  const { isEventAdmin } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);
  const { t } = useTranslation();
  const [rosters, setRosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRosters = async (eventId) => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsAcceptedInfos', null, {
        eventId,
      })
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

  useEffect(() => {
    if (eventId) {
      getData();
    }
  }, [eventId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!rosters.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('there_is_no_rosters_for_this_event')}
      </Typography>
    );
  }
  return <Rosters isEventAdmin={isEventAdmin} rosters={rosters} update={getData} />;
}
