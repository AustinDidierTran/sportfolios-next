import { Games } from '../../../../typescript/types';
import moment from 'moment';

export function sortGames(allGames: Games[]): { games: Games[]; pastGames: Games[] } {
  const games = allGames
    .filter(
      (game) => moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') > moment() || !game.startTime
    )
    .sort((a, b) => {
      if (!b.startTime) {
        return -Infinity;
      } else if (!a.startTime) {
        return Infinity;
      }
      return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
    });

  const pastGames = allGames
    .filter((game) => moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') < moment())
    .sort((a, b) => moment(b.startTime).valueOf() - moment(a.startTime).valueOf());

  return { games, pastGames };
}
