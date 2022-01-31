import { Organization } from '../../../../../typescript/entity';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Member, Report } from '../../../../../typescript/types';

const BASE_URL = '/api/organization';

export function getMembers(id: string, searchQuery: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/members`, null, { id, searchQuery }), { method: 'GET' }).then((res) => res.data);
}

export function getReports(id: string): Promise<Report[]> {
  return api(formatRoute(`${BASE_URL}/reports`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export const generateReport = (reportId: string): Promise<any> => {
  return api(formatRoute(`${BASE_URL}/generateReport`, null, { reportId }), { method: 'GET' }).then((res) => res.data);
};

export const deleteReport = (reportId: string): Promise<any> => {
  return api(formatRoute(BASE_URL, null, { reportId }), { method: 'DELETE' }).then((res) => res.data);
};
