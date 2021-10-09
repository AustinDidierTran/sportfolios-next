import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Person } from '../../../../../typescript/types';
import { IEventRankings } from '../../../../../typescript/event';
import { EVENT_TYPE } from '../../../../common/enums';

const BASE_URL = '/api/event';

/**
 * GET
 */
export function getAllPeopleRegisteredNotInTeamsInfos(eventId: string): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`, null, { eventId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export const getEventRankings = (eventId: string): Promise<IEventRankings> => {
  return api(formatRoute(`${BASE_URL}/rankings`, null, { eventId })).then((res) => res.data);
};

export const verifyTeamNameUnique = (name: string, eventId: string): Promise<boolean> => {
  return api(formatRoute(`${BASE_URL}/verifyTeamNameIsUnique`, null, { name, eventId })).then((res) => res.data);
};

interface ICreatePayload {
  name: string;
  creator: string;
  maximumSpots: number;
  ticketLimit: number;
  start: string;
  end: string;
  eventType: EVENT_TYPE;
  photoUrl: string;
}

/**
 * POST
 */
export const create = (data: ICreatePayload): Promise<any> => {
  return api(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      creator: data.creator,
      maximumSpots: data.maximumSpots,
      ticketLimit: data.ticketLimit,
      start: data.start,
      end: data.end,
      eventType: data.eventType,
      photoUrl: data.photoUrl,
    }),
  });
};
