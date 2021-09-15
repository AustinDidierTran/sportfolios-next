import { Team } from '../../../../../typescript/team';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const ADMIN_BASE_URL = '/api/admin/team';

/**
 * Requires app admin role
 */
export function getTeams(limit: number, page: number): Promise<{ count: number; teams: Team[] }> {
  return api(formatRoute(ADMIN_BASE_URL, null, { limit, page }), { method: 'GET' }).then((res) => res.data);
}
