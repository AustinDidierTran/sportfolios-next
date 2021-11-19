import conf from "./conf";
const status = conf.ENVIRONMENT === "dev" ? true : false;

export const FEATURE_MESSAGES_ENABLED = status;
export const FEATURE_GOOGLE_LOGIN = status;