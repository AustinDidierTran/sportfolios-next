import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Person } from '../../../../../typescript/types';
import { IEventRankings } from '../../../../../typescript/entity';

const BASE_URL = '/api/event';

export function getAllPeopleRegisteredNotInTeamsInfos(eventId: string): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`, null, { eventId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export const getEventRankings = (eventId: string): Promise<IEventRankings> => {
  return api(formatRoute(`${BASE_URL}/rankings`, null, { eventId })).then((res) => res.data);
};

