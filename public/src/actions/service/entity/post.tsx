import api from '../../api';
import { Person, Player } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export function addRoster(
  teamId: string,
  // eslint-disable-next-line no-undef
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  name: string
): Promise<number> {
  return api(`${BASE_URL}/roster`, { method: 'POST', body: JSON.stringify({ teamId, players, name }) }).then(
    (res) => res.status
  );
}

export function addEntity(
  name: string,
  surname: string,
  type: string,
  creator: string,
  maximumSpots: string,
  startDate: string,
  endDate: string,
  eventType: string
): Promise<string> {
  return api(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ name, surname, type, creator, maximumSpots, startDate, endDate, eventType }),
  }).then((res) => res.data.id);
}

export function addExercise(
  exerciseId: string,
  name: string,
  description: string,
  practiceId: string,
  teamId: string,
  type = 'default'
): Promise<number> {
  return api(`${BASE_URL}/exercise`, {
    method: 'POST',
    body: JSON.stringify({ exerciseId, name, description, type, sessionId: practiceId, teamId }),
  }).then((res) => res.status);
}

export function addPhase(phase: string, spots: number, eventId: string, type: string): Promise<number> {
  return api('/api/entity/phase', { method: 'POST', body: JSON.stringify({ phase, spots, eventId, type }) }).then(
    (res) => res.status
  );
}

export function addPlayers(teamId: string, players: Player[]): Promise<number> {
  return api(`${BASE_URL}/players`, { method: 'POST', body: JSON.stringify({ teamId, players }) }).then(
    (res) => res.status
  );
}

export function sendRequestToJoinTeam(teamId: string, personId: string): Promise<number> {
  return api(`${BASE_URL}/joinTeam`, { method: 'POST', body: JSON.stringify({ teamId, personId }) }).then(
    (res) => res.status
  );
}
