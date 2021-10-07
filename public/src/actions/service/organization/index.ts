import { Organization } from '../../../../../typescript/entity';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Member } from '../../../../../typescript/types';

const BASE_URL = '/api/organization';

export function getMembers(id: string, searchQuery: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/members`, null, { id, searchQuery }), { method: 'GET' }).then((res) => res.data);
}
