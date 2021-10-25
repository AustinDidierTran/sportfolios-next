import { ITicket } from '../../../../../typescript/game';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/game';

/**
 * GET
 */

export const getPurchasedTickets = (gameId: string): Promise<ITicket> => {
  return api(formatRoute(`${BASE_URL}/purchasedTickets`, null, { gameId }), { method: 'GET' }).then((res) => res.data);
};

/**
 * POST
 */

export function submitSpirit(
  submittedByRoster: string,
  submittedByPerson: string,
  gameId: string,
  submittedForRoster: string,
  spiritScore: number,
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
      comment,
    }),
  }).then((res) => res.status);
}

export const addTicketOption = (
  eventId: string,
  name: string,
  description: string,
  price: number,
  creatorId: string
): Promise<any> => {
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
