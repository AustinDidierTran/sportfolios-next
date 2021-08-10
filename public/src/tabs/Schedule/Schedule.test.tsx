import { sortGames } from './Schedule.utils';
import moment from 'moment';
import { Games } from '../../../../typescript/types';

describe('sortGames', () => {
  const game = {
    id: '123',
    phaseId: '123',
    eventId: '123',
    description: '123',
    entityId: '123',
    notifiedStart: '123',
    notifiedEnd: '123',
    locationId: '123',
    phaseName: '123',
    field: '123',
    fieldId: '123',
  };

  const allGames1: Games[] = [
    { startTime: moment().format(), ...game, positions: [] },
    { startTime: moment().add(1, 'day').format(), ...game, positions: [] },
  ];
  const res1: { games: Games[]; pastGames: Games[] } = { games: allGames1, pastGames: [] };

  const allGames2: Games[] = [
    { startTime: moment().subtract(1, 'day').format(), ...game, positions: [] },
    { startTime: moment().subtract(1, 'week').format(), ...game, positions: [] },
  ];
  const res2: { games: Games[]; pastGames: Games[] } = { games: [], pastGames: allGames2 };

  const allGames3: Games[] = [{ startTime: null, ...game, positions: [] }];
  const res3: { games: Games[]; pastGames: Games[] } = { games: allGames3, pastGames: [] };

  it('should return', async () => {
    expect(sortGames(allGames1)).toStrictEqual(res1);
    expect(sortGames(allGames2)).toStrictEqual(res2);
    expect(sortGames(allGames3)).toStrictEqual(res3);
  });
});
