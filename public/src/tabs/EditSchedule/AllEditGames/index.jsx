import React, { useState, useEffect, useContext } from 'react';
import styles from './AllEditGames.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import moment from 'moment';
import ProTip from './ProTip';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../../components/Custom';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

const GameFilters = dynamic(() => import('../../Schedule/AllGames/GameFilters'));
const EditGames = dynamic(() => import('./EditGames'));

export default function AllEditGames(props) {
  const { t } = useTranslation();
  const { oldFilter, setFilter, updated } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [games, setGames] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      getGames();
    }
  }, [eventId, updated]);

  const sortGames = (games) => {
    const res = games
      .filter((game) => moment(game.start_time).set('hour', 0).set('minute', 0).add(1, 'day') > moment())
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    setGames(res);
    const pastGames = games
      .filter((game) => moment(game.start_time).set('hour', 0).set('minute', 0).add(1, 'day') < moment())
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    setPastGames(pastGames);
  };

  const getGames = async () => {
    const { data } = await api(formatRoute('/api/entity/games', null, { eventId }));
    sortGames(data);
    setIsLoading(false);
    return data;
  };

  const filter = async (teamId, teamName, phaseId, phaseName, fieldId, fieldName, timeSlot, onlyYourGames) => {
    let games = await getGames();
    let filter = {
      teamId: SELECT_ENUM.ALL,
      teamName: '',
      phaseId: SELECT_ENUM.ALL,
      phaseName: '',
      fieldId: SELECT_ENUM.ALL,
      fieldName: '',
      timeSlot: SELECT_ENUM.ALL,
      onlyYourGames,
    };
    if (teamId != SELECT_ENUM.ALL) {
      games = games.filter((game) =>
        game.positions.some((team) => {
          if (team.roster_id) {
            return team.roster_id === teamId;
          }
          return team.name.includes(teamName);
        })
      );
      filter.teamName = teamName;
      filter.teamId = teamId;
    }
    if (phaseId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.phase_id === phaseId);
      filter.phaseName = phaseName;
      filter.phaseId = phaseId;
    }
    if (fieldId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.field_id === fieldId);
      filter.fieldName = fieldName;
      filter.fieldId = fieldId;
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      games = games.filter(
        (game) => moment.utc(game.start_time).format('YYYY M D') === moment.utc(timeSlot).format('YYYY M D')
      );
      filter.timeSlot = timeSlot;
    }
    setFilter(filter);
    sortGames(games);
  };

  const update = () => {
    getGames();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} oldFilter={oldFilter} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        <EditGames title={t('past_games')} games={pastGames} isOpen={false} update={update} />
        <EditGames title={t('upcoming_games')} games={games} isOpen update={update} />
      </div>
    </>
  );
}
