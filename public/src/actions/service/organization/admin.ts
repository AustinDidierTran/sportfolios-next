import { Organization } from '../../../../../typescript/entity';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const ADMIN_BASE_URL = '/api/admin/organization';

/**
 * Requires app admin role
 */
export function getAllTheOrganizations(
  limit: number,
  page: number,
  query?: string
): Promise<{ count: number; organizations: Organization[] }> {
  return api(formatRoute(ADMIN_BASE_URL, null, { limit, page, query }), { method: 'GET' }).then((res) => res.data);
}

export function deleteOrganization(id: string, restore: boolean): Promise<void> {
  return api(formatRoute(ADMIN_BASE_URL, null, { id, restore }), { method: 'DELETE' });
}

export function verifyOrganization(id: string, verify: boolean): Promise<void> {
  return api(formatRoute(`${ADMIN_BASE_URL}/verify`, null, { id, verify }), { method: 'PUT' });
}
