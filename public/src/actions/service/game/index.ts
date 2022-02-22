import { ITicket } from '../../../../../typescript/game';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/game';

/**
 * GET
 */

export const getPurchasedTickets = ({
  eventId,
  gameId,
  returnAllTickets = false,
}: {
  eventId?: string;
  gameId?: string;
  returnAllTickets?: boolean;
}): Promise<ITicket[]> => {
  if (!eventId && !gameId) {
    throw new Error('eventId and gameId are not defined');
  }
  return api(formatRoute(`${BASE_URL}/purchasedTickets`, null, { eventId, gameId, returnAllTickets }), {
    method: 'GET',
  }).then((res) => res.data);
};

/**
 * POST
 */

interface SpiritValues {
  [key: string]: number;
}

export function submitSpirit(
  submittedByRoster: string,
  submittedByPerson: string,
  gameId: string,
  submittedForRoster: string,
  spiritScore: number,
  spiritDetails: SpiritValues,
  comment: string
): Promise<number> {
  return api(`${BASE_URL}/spirit`, {
    method: 'POST',
    body: JSON.stringify({
      submittedByRoster,
      submittedByPerson,
      gameId,
      submittedForRoster,
      spiritScore,
      spiritDetails,
      comment,
    }),
  }).then((res) => res.status);
}

export interface IAddTicketOptionProps {
  eventId: string;
  name: string;
  description?: string;
  price: number;
  creatorId: string;
}

export const addTicketOption = ({
  eventId,
  name,
  description,
  price,
  creatorId,
}: IAddTicketOptionProps): Promise<any> => {
  return api(`${BASE_URL}/ticketOption`, {
    method: 'POST',
    body: JSON.stringify({
      creatorId,
      description,
      eventId,
      name,
      price,
    }),
  });
};

// is going to be migrated
// eslint-disable-next-line
export const addTicketsToCart = (ticketSelection: any): Promise<any> => {
  return api(`${BASE_URL}/tickets`, {
    method: 'POST',
    body: JSON.stringify({
      ticketSelection,
    }),
  });
};

interface IUpdateGame {
  gameId: string;
  name: string;
  ticketLimit: number;
  description: string;
}

/**
 * PUT
 */
export const updateGame = (body: IUpdateGame): Promise<any> => {
  return api(BASE_URL, {
    method: 'PUT',
    body: JSON.stringify({
      gameId: body.gameId,
      name: body.name,
      ticketLimit: body.ticketLimit,
      description: body.description,
    }),
  });
};
