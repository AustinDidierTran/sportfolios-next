import Auth from '@aws-amplify/auth';
import { UserInfo } from '../../../../../typescript/user';
import { AuthErrorTypes } from '../../../../common/enums';
import { AUTH_ERROR_ENUM, errors, ERROR_ENUM } from '../../../../common/errors';
import { loginWithCognito, migrate } from '../../service/auth/auth';

const migrateFct = async (error: any, email: string, password: string) => {
  if (error.code === AuthErrorTypes.NotAuthorizedException) {
    const res = await migrate(email, password);
    if (res.status === 200) {
      await Auth.signIn(email, password).then((user) => {
        // Auth.completeNewPassword(user, password).then((user) => )
      });
    }
  }
};

const loginEmailFct = async (email: string, password: string): Promise<UserInfo> => {
  // Login With Cognito
  const user = await Auth.signIn(email, password).then((user) => {
    // On the first login with cognito, we need to initiate first password
    if (user.challengeName === AuthErrorTypes.NewPasswordRequired) {
      // This function also logins in the user
      return Auth.completeNewPassword(user, password);
    }

    return user;
  });

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
  return userInfo;
};

export const loginWithEmail = async (email: string, password: string): Promise<UserInfo> => {
  try {
    return loginEmailFct(email, password);
  } catch (error) {
    if (error.code === AuthErrorTypes.NotAuthorizedException) {
      const res = await migrate(email, password);

      if (res.status !== 200) {
        throw new Error(AUTH_ERROR_ENUM.MIGRATION_ERROR);
      }

      // Migration has been succesful, we don't need to look for other cases
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
