import { Organization } from '../../../../../typescript/entity';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/organization';

/**
 * [SPO-97] Promise should not return any, it should return an array of members
 */
export function getMembers(id: string, searchQuery: string): Promise<any> {
  return api(formatRoute(`${BASE_URL}/members`, null, { id, searchQuery }), { method: 'GET' }).then((res) => res.data);
}
