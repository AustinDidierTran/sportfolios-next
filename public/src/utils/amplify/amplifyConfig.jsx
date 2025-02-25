import Amplify from 'aws-amplify';
import { REGION, USER_POOL_ID, CLIENT_ID, CLIENT_BASE_URL, COGNITO_DOMAIN } from '../../../../conf.js';
Amplify.Auth.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
  },
});

export const loadLoginGoogleConfig = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/login/google`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/login`,
        responseType: 'token',
      },
    },
  });
};

export const loadLoginFacebookConfig = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/login/facebook`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/login`,
        responseType: 'token',
      },
    },
  });
};

export const loadAddEmailConfigGoogle = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/userSettings/google`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/login`,
        responseType: 'token',
      },
    },
  });
};

export const loadAddEmailConfigFacebook = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/userSettings/facebook`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/login`,
        responseType: 'token',
      },
    },
  });
};

export const loadSignupGoogleConfig = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/signup/google`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/signup`,
        responseType: 'token',
      },
    },
  });
};

export const loadSignupFacebookConfig = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: COGNITO_DOMAIN,
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: `${CLIENT_BASE_URL}/page/signup/facebook`,
        redirectSignOut: `${CLIENT_BASE_URL}/page/signup`,
        responseType: 'token',
      },
    },
  });
};
