import conf from './conf';
const ENV_ENUM = { PROD: 1, STAGING: 2, DEV: 3 };
const env = ENV_ENUM[conf.ENVIRONMENT] || 1;

export const FEATURE_MESSAGES_ENABLED = env >= ENV_ENUM.STAGING;
export const FEATURE_GOOGLE_LOGIN = env >= ENV_ENUM.STAGING;
export const FEATURE_FACEBOOK_LOGIN = env >= ENV_ENUM.STAGING;
