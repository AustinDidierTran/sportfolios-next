import api from '../../api';

const BASE_URL = '/api/game';

export function submitSpirit(
  submittedByRoster: string,
  submittedByPerson: string,
  gameId: string,
  submittedForRoster: string,
  spiritScore: number,
  comment: string
): Promise<number> {
  return api(`${BASE_URL}/spirit`, {
    method: 'POST',
    body: JSON.stringify({
      submittedByRoster,
      submittedByPerson,
      gameId,
      submittedForRoster,
      spiritScore,
      comment,
    }),
  }).then((res) => res.status);
}
