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

export function deleteRoster(id: string): Promise<number> {
  return api(formatRoute('/api/entity/roster', null, { id }), { method: 'DELETE' }).then((res) => res.status);
}

export function deleteEntity(id: string, type: string): void {
  api(formatRoute('/api/entity', null, { id, type }), { method: 'DELETE' });
}
