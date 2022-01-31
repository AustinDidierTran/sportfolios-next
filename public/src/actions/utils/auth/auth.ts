import Auth from '@aws-amplify/auth';
import { UserInfo } from '../../../../../typescript/user';
import { AuthErrorTypes } from '../../../../common/enums';
import { AUTH_ERROR_ENUM, errors, ERROR_ENUM } from '../../../../common/errors';
import { loginWithCognito, migrate, signup, validEmail } from '../../service/auth/auth';

interface LoginEmailResponse {
  userInfo: UserInfo;
  token: string;
}

const loginEmailFct = async (email: string, password: string): Promise<LoginEmailResponse> => {
  // Login With Cognito
  let user = await Auth.signIn(email, password);
  // On the first login with cognito, we need to initiate first password
  if (user.challengeName === AuthErrorTypes.NewPasswordRequired) {
    // This function also logins in the user
    user = await Auth.completeNewPassword(user, password);
  }

  // Login to replicate the behavior of the if statement
  const token = user?.signInUserSession?.idToken?.jwtToken;
  const data = await loginWithCognito(email, token);

  if (!data) {
    throw new Error(AUTH_ERROR_ENUM.NO_EXISTING_ACCOUNT);
  }

  const { userInfo } = typeof data === 'string' ? JSON.parse(data) : data;

  if (!userInfo) {
    throw new Error(AUTH_ERROR_ENUM.NO_EXISTING_ACCOUNT);
  }

  return { userInfo, token };
};

const migrateFct = async (email: string, password: string) => {
  try {
    const res = await migrate(email, password);
    if (res.status !== 200) {
      throw new Error(AUTH_ERROR_ENUM.MIGRATION_ERROR);
    }
  } catch (error) {
    console.log('migrateFct', error);
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<LoginEmailResponse> => {
  try {
    return await loginEmailFct(email, password);
  } catch (error) {
    if (error.code === AuthErrorTypes.NotAuthorizedException) {
      // Migration will fail if
      await migrateFct(email, password);

      // Migration has been succesful
      return loginEmailFct(email, password);
    }
    // eslint-disable-next-line
    console.error('Unexpected login error...', error);

    if (error === errors[ERROR_ENUM.UNCONFIRMED_EMAIL].code) {
      // Email is not validated
      throw new Error(AUTH_ERROR_ENUM.UNCONFIRMED_EMAIL);
    }

    throw new Error(AUTH_ERROR_ENUM.ERROR_OCCURED);
  }
};

export const signupWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    const isEmailValid = await validEmail(email);

    if (!isEmailValid) {
      throw new Error(AUTH_ERROR_ENUM.EMAIL_ALREADY_TAKEN);
    }

    await Auth.signUp({
      username: email,
      password,
    });

    await signup(email);
  } catch (error) {
    if (error.code === AuthErrorTypes.InvalidUsername) {
      throw new Error(AUTH_ERROR_ENUM.EMAIL_ALREADY_TAKEN);
    }
    throw new Error(AUTH_ERROR_ENUM.ERROR_OCCURED);
  }
};
