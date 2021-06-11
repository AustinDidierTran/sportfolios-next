import React, { useState, useEffect, useContext } from 'react';
import styles from './Games.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import moment from 'moment';
import GameFilters from './GameFilters';
import Games from './Games';
import { useTranslation } from 'react-i18next';
import ProTip from './ProTip';
import { LoadingSpinner } from '../../../components/Custom';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

export default function AllGames(props) {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { setFilter, oldFilter } = props;
  const [games, setGames] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      getGames();
    }
  }, [eventId]);

  const scoreIsSubmitted = (game) => game.positions[0].score != 0 || game.positions[1].score != 0;

  const sortGames = (games) => {
    const pastGames = games
      .filter(
        (game) =>
          moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') < moment() && scoreIsSubmitted(game)
      )
      .sort((a, b) => moment(a.startTime) - moment(b.startTime));
    setPastGames(pastGames);
    const res = games
      .filter(
        (game) =>
          moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') > moment() || !scoreIsSubmitted(game)
      )
      .sort((a, b) => moment(a.startTime) - moment(b.startTime));
    setGames(res);
  };

  const getGames = async () => {
    if (eventId) {
      const { data } = await api(formatRoute('/api/entity/games', null, { eventId }));
      if (!data) {
        return [];
      }
      sortGames(data);
      setIsLoading(false);
      return data;
    }
    setIsLoading(false);
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
        (game) => moment(game.startTime).format('YYYY M D') === moment(timeSlot).format('YYYY M D')
      );
      filter.timeSlot = timeSlot;
    }
    setFilter(filter);
    sortGames(games);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} oldFilter={oldFilter} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        <Games games={pastGames} style={{ marginBottom: '16px' }} title={t('past_games')} isOpen={false} />
        <Games games={games} style={{ marginBottom: '16px' }} title={t('upcoming_games')} isOpen />
      </div>
    </>
  );
}
