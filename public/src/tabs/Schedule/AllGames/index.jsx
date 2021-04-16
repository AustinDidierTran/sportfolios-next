import React, { useState, useEffect } from 'react';
import styles from './Games.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import moment from 'moment';
import GameFilters from './GameFilters';
import Games from './Games';
import { useTranslation } from 'react-i18next';
import ProTip from './ProTip';
import { LoadingSpinner } from '../../../components/Custom';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';

export default function AllGames() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const [games, setGames] = useState([]);
  const [pastGames, setPastGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGames();
  }, [eventId]);

  const scoreIsSubmitted = (game) => game.positions[0].score != 0 || game.positions[1].score != 0;

  const sortGames = (games) => {
    const pastGames = games
      .filter(
        (game) =>
          moment(game.start_time).set('hour', 0).set('minute', 0).add(1, 'day') < moment() && scoreIsSubmitted(game)
      )
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    setPastGames(pastGames);
    const res = games
      .filter(
        (game) =>
          moment(game.start_time).set('hour', 0).set('minute', 0).add(1, 'day') > moment() || !scoreIsSubmitted(game)
      )
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    setGames(res);
  };

  const getGames = async () => {
    const { data } = await api(formatRoute('/api/entity/games', null, { eventId }));
    sortGames(data);
    setIsLoading(false);
    return data;
  };

  const filter = async (teamId, teamName, phaseId, fieldId, timeSlot) => {
    let games = await getGames();
    if (teamId != SELECT_ENUM.ALL) {
      games = games.filter((game) =>
        game.positions.some((team) => {
          if (team.roster_id) {
            return team.roster_id === teamId;
          }
          return team.name.includes(teamName);
        })
      );
    }
    if (phaseId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.phase_id === phaseId);
    }
    if (fieldId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.field_id === fieldId);
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      games = games.filter(
        (game) => moment(game.start_time).format('YYYY M D') === moment(timeSlot).format('YYYY M D')
      );
    }
    sortGames(games);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        <Games games={pastGames} style={{ marginBottom: '16px' }} title={t('past_games')} isOpen={false} />
        <Games games={games} style={{ marginBottom: '16px' }} title={t('upcoming_games')} isOpen />
      </div>
    </>
  );
}
