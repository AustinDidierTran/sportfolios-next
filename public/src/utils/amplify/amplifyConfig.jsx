import Amplify from 'aws-amplify';
import { REGION, USER_POOL_ID, CLIENT_ID } from '../../../../conf.js';
Amplify.Auth.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
    oauth: {
      domain: 'devsportfoliosapp.auth.us-east-2.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://localhost:3000/page/login/google',
      redirectSignOut: 'https://localhost:3000/page/login',
      responseType: 'token',
    },
  },
});

export const loadAddEmailConfig = async () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: CLIENT_ID,
      oauth: {
        domain: 'devsportfoliosapp.auth.us-east-2.amazoncognito.com',
        scope: ['email', 'profile', 'openid'],
        redirectSignIn: 'https://localhost:3000/page/userSettings/google',
        redirectSignOut: 'https://localhost:3000/page/login',
        responseType: 'token',
      },
    },
  });
};
