import api from '../../api';
import { Person } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export function updatePracticeRsvp(id: string, rsvp: string, personId?: string, multipleRsvp = false): Promise<number> {
  return api(`${BASE_URL}/practiceRsvp`, {
    method: 'PUT',
    body: JSON.stringify({ id, rsvp, personId, updateAll: multipleRsvp }),
  }).then((res) => res.status);
}

export function updatePlayer(id: string, role: string): Promise<number> {
  return api(`${BASE_URL}/player`, { method: 'PUT', body: JSON.stringify({ id, role }) }).then((res) => res.status);
}

export function updateTeamPlayerAcceptation(teamId: string, personId: string, statusProps: string): Promise<string> {
  return api(`${BASE_URL}/teamPlayerAcceptation`, {
    method: 'PUT',
    body: JSON.stringify({ teamId, personId, status: statusProps }),
  }).then((res) => res.status);
}

export function updatePractice(
  id: string,
  name: string,
  dateStart: string | null,
  dateEnd: string | null,
  newLocation: string | undefined,
  locationId: string | null,
  address: string | undefined
): Promise<number> {
  return api(`${BASE_URL}/practice`, {
    method: 'PUT',
    body: JSON.stringify({ id, name, dateStart, dateEnd, newLocation, locationId, address }),
  }).then((res) => res.status);
}

export function updateRoster(
  // eslint-disable-next-line no-undef
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  id: string,
  name: string
): Promise<number> {
  return api(`${BASE_URL}/roster`, { method: 'PUT', body: JSON.stringify({ players, id, name }) }).then(
    (res) => res.status
  );
}
