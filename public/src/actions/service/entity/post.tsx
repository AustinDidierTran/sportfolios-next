import api from '../../api';
import { Person, Player } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export async function addRoster(
  teamId: string,
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  name: string
): Promise<number> {
  const res = await api(`${BASE_URL}/roster`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      players,
      name,
    }),
  });
  return res.status;
}

export async function addEntity(
  name: string,
  surname: string,
  type: string,
  creator: string,
  maximumSpots: string,
  startDate: string,
  endDate: string,
  eventType: string
): Promise<string> {
  const res = await api(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
      name,
      surname,
      type,
      creator,
      maximumSpots,
      startDate,
      endDate,
      eventType,
    }),
  });
  return res.data.id;
}

export async function addExercise(
  exerciseId: string,
  name: string,
  description: string,
  practiceId: string,
  teamId: string
): Promise<number> {
  return api(`${BASE_URL}/exercise`, {
    method: 'POST',
    body: JSON.stringify({ exerciseId, name, description, sessionId: practiceId, teamId }),
  }).then((res) => res.status);
}

export async function addPlayers(teamId: string, players: Player[]): Promise<number> {
  const { status } = await api(`${BASE_URL}/players`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      players,
    }),
  });
  return status;
}

export async function sendRequestToJoinTeam(teamId: string, personId: string): Promise<number> {
  const { status } = await api(`${BASE_URL}/joinTeam`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      personId,
    }),
  });
  return status;
}
