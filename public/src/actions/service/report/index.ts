import { REPORT_TYPE_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/report';

export const getReport = async (reportId: string): Promise<any> => {
  return api(formatRoute(BASE_URL, null, { reportId }), {
    method: 'GET',
  }).then((res) => res.data);
};

/** POST */

export const createReport = async (type: REPORT_TYPE_ENUM, organizationId: string, date: string): Promise<any> => {
  return api(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
      type,
      organizationId,
      date,
    }),
  });
};
