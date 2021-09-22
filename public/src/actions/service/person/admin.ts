import { Person } from '../../../../../typescript/entity';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const ADMIN_BASE_URL = '/api/admin/person';

/**
 * Requires app admin role
 */
export function getAllThePeople(
  limit: number,
  page: number,
  query?: string
): Promise<{ count: number; people: Person[] }> {
  return api(formatRoute(ADMIN_BASE_URL, null, { limit, page, query }), { method: 'GET' }).then((res) => res.data);
}

export function deletePerson(id: string, restore: boolean): Promise<void> {
  return api(formatRoute(ADMIN_BASE_URL, null, { id, restore }), { method: 'DELETE' });
}
