import api from '../../api';

const AUTH_BASE_URL = '/api/auth/';

export async function validEmail(email: string): Promise<boolean> {
  return api(`${AUTH_BASE_URL}/validEmail`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
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
