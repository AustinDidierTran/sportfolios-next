import api from '../../api';
import { UserInfo } from '../../../../../typescript/user';

const AUTH_BASE_URL = '/api/auth';

export async function validEmail(email: string): Promise<boolean> {
  return api(`${AUTH_BASE_URL}/validEmail`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).then((res) => res.data);
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  newsLetterSubscription: boolean
): Promise<number> {
  return api(`${AUTH_BASE_URL}/signupWithCognito`, {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      newsLetterSubscription,
    }),
  });
}

export async function loginWithCognito(email: string, token: string): Promise<UserInfo> {
  return api(`${AUTH_BASE_URL}/loginWithCognito`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      token,
    }),
  });
}

export async function migrate(email: string, password: string): Promise<any> {
  console.log('inside auth service in migrate function', { email, password });
  try {
    return api(`${AUTH_BASE_URL}/migrate`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
