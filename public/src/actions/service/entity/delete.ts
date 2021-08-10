import { Game } from '../../../../../typescript/types';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
const BASE_URL = '/api/entity';

export function deletePlayer(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/player`, null, { id }), { method: 'DELETE' }).then((res) => res.status);
}

export async function deletePractice(teamId: string, practiceId: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/practice`, null, { teamId, practiceId }), { method: 'DELETE' }).then(
    (res) => res.status
  );
}

export function deleteRosterPlayer(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/rosterPlayer`, null, { id }), { method: 'DELETE' }).then((res) => res.status);
}

export function deleteGame(eventId: string, gameId: string): Promise<Game> {
  return api(formatRoute(`${BASE_URL}/game`, null, { eventId, gameId }), { method: 'DELETE' });
}

export function deleteRoster(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/roster`, null, { id }), { method: 'DELETE' }).then((res) => res.status);
}
export function deleteField(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/field`, null, { id }), { method: 'DELETE' }).then((res) => res.status);
}

export function deleteTimeslot(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/timeslot`, null, { id }), { method: 'DELETE' }).then((res) => res.status);
}

export function deleteEntity(id: string, type: string): Promise<number> {
  return api(formatRoute('/api/entity', null, { id, type }), { method: 'DELETE' }).then((res) => res.status);
}

export function deleteSessionExercise(sessionId: string, exerciseId: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/sessionExercise`, null, { sessionId, exerciseId }), { method: 'DELETE' }).then(
    (res) => res.status
  );
}
