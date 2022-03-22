import { Notification } from '../../../../../typescript/notifications';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';

const BASE_URL = '/api/notifications';

export const getNotifications = async (currentPage: number, perPage: number): Promise<Notification[]> => {
  return api(formatRoute(`${BASE_URL}/all`, null, { currentPage, perPage }), { method: 'GET' }).then((res) => res.data);
};

export const getNotificationsCount = async (): Promise<number> => {
  return api(`${BASE_URL}/unseenCount`, { method: 'GET' }).then((res) => res.data);
};

export const seeNotifications = async (): Promise<void> => {
  return api(`${BASE_URL}/see`, { method: 'PUT' });
};

export const acceptScoreFromNotification = (myRosterId: string, scoreId: string, myPlayerId: string) => {
  return api('/api/entity/acceptScore', {
    method: 'POST',
    body: JSON.stringify({
      submitted_by_roster: myRosterId,
      id: scoreId,
      submitted_by_person: myPlayerId,
    }),
  });
};
