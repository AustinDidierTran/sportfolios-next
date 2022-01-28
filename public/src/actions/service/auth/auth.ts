import api from '../../api';
import { UserInfo } from '../../../../../typescript/user';

const AUTH_BASE_URL = '/api/auth';

export const validEmail = async (email: string): Promise<boolean> => {
  return api(`${AUTH_BASE_URL}/validEmail`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).then((res) => res.data);
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  newsLetterSubscription: boolean
): Promise<number> => {
  return api(`${AUTH_BASE_URL}/signupWithCognito`, {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      newsLetterSubscription,
    }),
  });
};

export const signupGoogleToken = async (token: string): Promise<number> => {
  return api(`${AUTH_BASE_URL}/signupGoogleToken`, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
  });
};

export const signupFacebookToken = async (token: string): Promise<number> => {
  return api(`${AUTH_BASE_URL}/signupFacebookToken`, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
  });
};

export const loginWithCognito = async (email: string, token: string): Promise<UserInfo> => {
  return api(`${AUTH_BASE_URL}/loginWithCognito`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      token,
    }),
  }).then((res) => res.data);
};

export const loginWithCognitoToken = async (token: string): Promise<UserInfo> => {
  return api(`${AUTH_BASE_URL}/loginWithCognitoToken`, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
  });
};

export const migrate = async (email: string, password: string): Promise<any> => {
  console.log('calling migrate');
  return api(`${AUTH_BASE_URL}/migrate`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
};
