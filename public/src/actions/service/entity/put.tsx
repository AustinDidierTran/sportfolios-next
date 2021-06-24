import api from '../../api';
import { Person } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export async function updatePracticeRsvp(
  id: string,
  rsvp: string,
  personId?: string,
  multipleRsvp: boolean = false
): Promise<number> {
  const { status } = await api(`${BASE_URL}/practiceRsvp`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      rsvp,
      personId,
      updateAll: multipleRsvp,
    }),
  });
  return status;
}

export async function updatePlayer(id: string, role: string): Promise<number> {
  const { status } = await api(`${BASE_URL}/player`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      role,
    }),
  });
  return status;
}

export async function updateTeamPlayerAcceptation(
  teamId: string,
  personId: string,
  statusProps: string
): Promise<string> {
  const { status } = await api(`${BASE_URL}/teamPlayerAcceptation`, {
    method: 'PUT',
    body: JSON.stringify({
      teamId,
      personId,
      status: statusProps,
    }),
  });
  return status;
}

export async function updatePractice(
  id: string,
  name: string,
  dateStart: string | null,
  dateEnd: string | null,
  newLocation: string | undefined,
  locationId: string | null,
  address: string | undefined
): Promise<number> {
  const { status } = await api(`${BASE_URL}/practice`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      name,
      dateStart,
      dateEnd,
      newLocation,
      locationId,
      address,
    }),
  });
  return status;
}

export async function updateRoster(
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  id: string,
  name: string
): Promise<number> {
  const { status } = await api(`${BASE_URL}/roster`, {
    method: 'PUT',
    body: JSON.stringify({
      players,
      id,
      name,
    }),
  });
  return status;
}
