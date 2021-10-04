import Amplify from 'aws-amplify';
import { REGION, USER_POOL_ID, CLIENT_ID } from '../../../../conf.js';

Amplify.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
  },
});
