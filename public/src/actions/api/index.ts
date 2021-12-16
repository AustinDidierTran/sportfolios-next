import { API_BASE_URL } from '../../../../conf';
import { Auth } from 'aws-amplify';
import '../../utils/amplify/amplifyConfig.jsx';
import { ROUTES_ENUM } from '../../../common/enums';

const api = async (
  route: string,
  { method, body }: { method?: string; body?: string } = {},
  refreshToken: boolean = true
): Promise<any> => {
  const headers: any = { 'Content-Type': 'application/json' };
  const authToken = (typeof window !== 'undefined' && localStorage.getItem('authToken')) || null;
  if (authToken && authToken !== 'null') {
    try {
      const dataAWS = await Auth.currentAuthenticatedUser();
      if (
        !dataAWS ||
        !refreshToken ||
        window.location.pathname === ROUTES_ENUM.userSettingsFacebook ||
        window.location.pathname === ROUTES_ENUM.userSettingsGoogle
      ) {
        headers.Authorization = authToken;
      } else if (!dataAWS?.signInUserSession?.idToken?.jwtToken) {
        headers.Authorization = authToken;
      } else {
        localStorage.setItem('authToken', dataAWS?.signInUserSession?.idToken?.jwtToken);
        headers.Authorization = dataAWS?.signInUserSession?.idToken?.jwtToken;
      }
    } catch (err) {
      // user is probably not authenticated
    }
  }

  if (method === 'POST') {
    const res = await fetch(`${API_BASE_URL}${route}`, { method: 'POST', headers, body });

    const status = res.status;

    const { data } = await res.json();

    return { data, status };
  }

  if (method === 'PUT') {
    const res = await fetch(`${API_BASE_URL}${route}`, { method: 'PUT', headers, body });

    const status = res.status;

    const { data } = await res.json();

    return { data, status };
  }

  if (method === 'DELETE') {
    const res = await fetch(`${API_BASE_URL}${route}`, { method: 'DELETE', headers });

    const status = res.status;

    const { data } = await res.json();

    return { data, status };
  }

  if (method === 'GET') {
    const headers: any = { Authorization: authToken };
    const res = await fetch(`${API_BASE_URL}${route}`, { headers });

    const status = res.status;

    const { data } = await res.json();

    return { data, status };
  }
  // Then, it is a get
  // eslint-disable-next-line no-console
  console.warn(
    `You are using the api function with the route ${route} without specifying the method. Support may be deprecated please fix this.`
  );
  const res = await fetch(`${API_BASE_URL}${route}`, { headers }).then((res) => res.json());
  return res;
};

export default api;

export const changeEntityName = async (
  id: string,
  {
    name,
    surname,
  }: {
    name?: string;
    surname?: string;
  } = {}
): Promise<any> => {
  const bodyJSON: { id?: string; name?: string; surname?: string } = { id };

  if (name) {
    bodyJSON.name = name;
  }
  if (surname) {
    bodyJSON.surname = surname;
  }

  return api('/api/entity', {
    method: 'PUT',
    body: JSON.stringify(bodyJSON),
  });
};
