import React, { useState, useEffect, useContext } from 'react';
import styles from './Results.module.css';
// import { SELECT_ENUM } from '../../../common/enums';
import api from '../../actions/api';
import moment from 'moment';
import Game from '../Schedule/AllGames/Games/Game';
// import GameFilters from '../Schedule/AllGames/GameFilters';
import SubmitScore from '../Schedule/AllGames/ProTip';
import { formatRoute } from '../../utils/stringFormats';
import { Store } from '../../Store';

export default function Results() {
  const {
    state: { id: eventId },
  } = useContext(Store);
  const [games, setGames] = useState([]);
  // const onlyPast = true;

  useEffect(() => {
    if (eventId) {
      getGames();
    }
  }, [eventId]);
  const sortGames = (games) => {
    const res = games
      .filter((game) => moment(game.start_time).set('hour', 0).set('minute', 0).add(1, 'day') < moment())
      .sort((a, b) => moment(a.start_time) - moment(b.start_time));
    return res;
  };

  const getGames = async () => {
    const { data } = await api(formatRoute('/api/entity/games', null, { eventId }));
    const res = sortGames(data);
    setGames(res);
    return res;
  };

  //FIXME: teams aren't used anymore, only phase position
  // const filter = async (teamName, phaseId, field, timeSlot) => {
  //   let games = await getGames();
  //   if (teamName != SELECT_ENUM.ALL) {
  //     games = games.filter((game) => game.teams.some((team) => team.name === teamName));
  //   }
  //   if (phaseId != SELECT_ENUM.ALL) {
  //     games = games.filter((game) => game.phase_id === phaseId);
  //   }
  //   if (field != SELECT_ENUM.ALL) {
  //     games = games.filter((game) => game.field === field);
  //   }
  //   if (timeSlot != SELECT_ENUM.ALL) {
  //     games = games.filter(
  //       (game) => moment(game.start_time).format('YYYY M D') === moment(timeSlot).format('YYYY M D')
  //     );
  //   }
  //   setGames(games);
  // };

  const update = () => {
    getGames();
  };

  return (
    <>
      <SubmitScore />
      {/* <GameFilters update={filter} onlyPast={onlyPast} /> */}
      <div className={styles.main} style={{ marginTop: '16px' }}>
        {games.map((game, index) => (
          <Game update={update} game={game} key={index} />
        ))}
      </div>
    </>
  );
}
