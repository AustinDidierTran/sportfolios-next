import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Person } from '../../../../../typescript/types';
import { IEventRankings } from '../../../../../typescript/event';

const BASE_URL = '/api/event';

export function getAllPeopleRegisteredNotInTeamsInfos(eventId: string): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`, null, { eventId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export const getEventRankings = (eventId: string): Promise<IEventRankings> => {
  return api(formatRoute(`${BASE_URL}/rankings`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
};

export const verifyTeamNameUnique = (name: string, eventId: string): Promise<boolean> => {
  return api(formatRoute(`${BASE_URL}/verifyTeamNameIsUnique`, null, { name, eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
};

export const updateRosterIdInRankings = (newRosterId: string, rankingId: string): Promise<any> => {
  return api(`${BASE_URL}/rosterIdInRankings`, {
    method: 'PUT',
    body: JSON.stringify({ newRosterId, rankingId }),
  }).then((res) => res.data);
};
