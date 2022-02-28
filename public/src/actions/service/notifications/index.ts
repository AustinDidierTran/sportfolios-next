import api from '../../api';

const BASE_URL = '/api/notifications';

export const getNotificationsCount = async (): Promise<number> => {
  return api(`${BASE_URL}/unseenCount`, { method: 'GET' }).then((res) => res.data);
};

export const seeNotifications = async (): Promise<void> => {
  return api(`${BASE_URL}/see`, { method: 'PUT' });
};
