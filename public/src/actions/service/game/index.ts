import api from '../../api';

const BASE_URL = '/api/game';

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
