import { IEventRankings } from '../../../../../typescript/event';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/event';

export const getEventRankings = (eventId: string): Promise<IEventRankings> => {
  return api(formatRoute(`${BASE_URL}/rankings`, null, { eventId })).then((res) => res.data);
};
