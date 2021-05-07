const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];
const MONTH_NAMES_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'];

const FIELD_GROUP_ENUM = {
  ADD_PAYMENT_OPTION: 'add payment option',
};

const ENTITIES_ROLE_ENUM = {
  ADMIN: 1,
  EDITOR: 2,
  VIEWER: 3,
};

const APP_ENUM = {
  FACEBOOK: 'Facebook',
  MESSENGER: 'Messenger',
  GOOGLE: 'Google',
  APPLE: 'Apple',
};

const SIZES_ENUM = {
  XXXS: '3x-small',
  XXS: '2x-small',
  XS: 'x-small',
  SM: 'small',
  M: 'medium',
  L: 'large',
  XL: 'x-large',
  XXL: '2x-large',
  XXXL: '3x-large',
};

const COMPONENT_TYPE_ENUM = {
  ADDRESS: 'address',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  DIVIDER: 'divider',
  EMPTY: 'empty',
  LIST_ITEM: 'list item',
  LIST: 'list',
  LINK: 'link',
  MULTISELECT: 'multiselect',
  PERSON_ITEM: 'person item',
  PERSON_SEARCH_LIST: 'person search list',
  PHONE_NUMBER: 'phone number',
  RADIO_GROUP: 'radio group',
  SELECT: 'select',
  TEXT_FIELD_BOX: 'text field box',
  TEXT_DOUBLE_BUTTON: 'text double button',
  FILE_UPLOAD: 'file upload',
};

const ROSTER_ROLE_ENUM = {
  CAPTAIN: 'captain',
  ASSISTANT_CAPTAIN: 'assistant-captain',
  COACH: 'coach',
  PLAYER: 'player',
  VIEWER: 'viewer',
};

const TAG_TYPE_ENUM = {
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
  PENDING: 'pending',
  REGISTERED: 'registered',
  UNREGISTERED: 'unregistered',
  DEFAULT: 'default',
};

const MEMBERSHIP_LENGTH_ENUM = {
  ONE_MONTH: 1,
  SIX_MONTH: 2,
  ONE_YEAR: 3,
};
const MEMBERSHIP_LENGTH_TYPE_ENUM = {
  FIXED: 'fixed',
  LENGTH: 'length',
};

const MEMBERSHIP_TYPE_ENUM = {
  ELITE: 1,
  COMPETITIVE: 2,
  RECREATIONAL: 3,
  JUNIOR: 4,
  NOT_SPECIFIED: 5,
};

const PHASE_STATUS_ENUM = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  DONE: 'done',
};

const PLATEFORM_FEES_PERCENTAGE = 0.059;
const PLATEFORM_FEES_FIX = 0.3;
const MIN_AMOUNT_FEES = 5;
const CARD_TYPE_ENUM = {
  CART: 'cart',
  CART_SUMMARY: 'cart summary',
  DELETE_ENTITY: 'delete entity',
  EDITABLE_GAME: 'editable game',
  EVENT_SETTINGS: 'event settings',
  EVENT: 'event',
  GAME: 'game',
  INVOICE: 'invoice',
  POST: 'post',
  COMMENT: 'comment',
  REPORT: 'report',
  SCORE_SUGGESTION: 'score suggestion',
  SHOP: 'shop',
  TWO_TEAM_GAME_EDITABLE: 'twoTeamGameEditable',
  TWO_TEAM_GAME: 'twoTeamGame',
  TWO_TEAM_GAME_PROFILE: 'twoTeamGameProfile',
  ACCEPT_PLAYER_INFOS: 'accept player infos',
  ACCEPT_TEAM_INFOS: 'accept team infos',
  OUR_TEAM_MEMBER: ' our team member',
};

const DIRECTION_ENUM = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

const TABS_ENUM = {
  ABOUT: 'about',
  HOME: 'home',
  CART: 'cart',
  EDIT: 'edit',
  EDIT_EVENTS: 'editEvents',
  EDIT_PERSON_INFOS: 'editPersonInfos',
  EDIT_RANKINGS: 'editRankings',
  EDIT_RESULTS: 'editResults',
  EDIT_ROSTERS: 'editRosters',
  EDIT_SCHEDULE: 'editSchedule',
  EVENT_INFO: 'eventInfo',
  EVENTS: 'events',
  GENERAL: 'general',
  MEMBERSHIPS: 'memberships',
  PURCHASES: 'purchases',
  RANKINGS: 'rankings',
  RESULTS: 'results',
  ROSTERS: 'roster',
  SCHEDULE: 'schedule',
  SETTINGS: 'settings',
  SHOP: 'shop',
};

const FORM_DIALOG_TYPE_ENUM = {
  SUBMIT_SCORE: 'score',
  SUBMIT_SCORE_AND_SPIRIT: 'score and spirit',
  ENTER_EMAIL: 'email',
  ADD_EVENT_PAYMENT_OPTION: 'add event payment option',
  EDIT_EVENT_PAYMENT_OPTION: 'edit event payment option',
  ADD_MEMBERSHIP: 'add membership',
  BECOME_MEMBER: 'become member',
  BECOME_MEMBER_COUPON: 'become member coupon',
  ADD_MEMBER: 'add member',
  EDIT_MEMBERSHIP: 'edit membership',
  MEMBERS_REPORT: 'members report',
  SALES_REPORT: 'sales_report',
  CREATE_TAX_RATE: 'create tax rate',
  ROSTER_PLAYER_OPTIONS: 'roster player options',
  EDIT_MEMBER_IMPORT: 'edit member import',
  ADD_FEE: 'add fee',
};

const HEADER_FLYOUT_TYPE_ENUM = {
  ACCOUNT: 'account',
  CLOSED: 'closed',
  CREATE: 'create.create',
  NOTIFICATIONS: 'notifications',
  PLUS: 'plus',
};

const REPORT_TYPE_ENUM = {
  MEMBERS: 'members',
  SALES: 'sales',
};

const LANGUAGE_ENUM = {
  ENGLISH: 'en',
  FRANCAIS: 'fr',
};

const SELECT_ENUM = {
  ALL: 'all',
};

const GENDER_ENUM = {
  MALE: 'Male',
  FEMALE: 'Female',
  NOT_SPECIFIED: 'Other',
};

const INVOICE_STATUS_ENUM = {
  DRAFT: 'draft',
  DELETED: 'deleted',
  FREE: 'free',
  OPEN: 'open',
  PAID: 'paid',
  REFUNDED: 'refunded',
  UNCOLLECTIBLE: 'uncollectible',
  VOID: 'void',
};

const COUPON_CODE_ENUM = {
  BECOME_MEMBER: 'become member',
};

const ROUTES_ENUM = {
  analytics: '/page/analytics',
  addBankAccount: '/page/addBankAccount',
  addPaymentMethod: '/page/addPaymentMethod',
  adminPanel: '/page/adminPanel',
  cart: '/page/cart',
  checkout: '/page/checkout',
  confirmationEmailSent: '/page/confirmationEmailSent/:email',
  confirmEmail: '/page/confirmEmail/:token',
  confirmEmailFailure: '/page/ConfirmEmailFailure',
  confirmEmailSuccess: '/page/confirmEmailSuccess',
  createEvent: '/page/createEvent',
  createOrganization: '/page/createOrganization',
  createPerson: '/page/createPerson',
  createTeam: '/page/createTeam',
  entity: '/:id',
  entityNotFound: '/page/entityNotFound',
  eventRegistration: '/page/eventRegistration/:id',
  forgotPassword: '/page/forgotPassword',
  home: '/',
  importMembers: '/page/importMembers',
  landingPage: '/page/landingPage',
  login: '/page/login',
  membersList: '/page/membersList',
  menu: '/page/menu',
  mockEvent: '/page/mock/Event/:openTab',
  optionPayment: '/page/optionPayment/:id',
  notifications: '/page/notifications',
  orderProcessed: '/page/orderProcessed',
  organizationList: '/page/organizationList',
  passwordRecovery: '/page/passwordRecovery',
  playersAcceptation: '/page/playersAcceptation/:id',
  privacyPolicy: '/page/privacy',
  productAddedToCart: '/page/productAddedToCart',
  paymentOptionStats: '/page/paymentOptionStats/:id',
  redirectWithToken: '/page/redirect',
  registrationStatus: '/page/registrationStatus',
  rosterInviteLink: '/page/inviteRoster/:token',
  sales: '/page/sales/:id',
  scheduleInteractiveTool: '/page/scheduleInteractiveTool/:id',
  scheduleManager: '/page/scheduleManager',
  search: '/page/search',
  shopDetails: '/page/shopDetails/:id/:stripePriceId',
  signup: '/page/signup',
  stripe: '/page/stripe',
  teamsAcceptation: '/page/teamsAcceptation/:id',
  transferPerson: '/page/transferPerson/:token',
  transferPersonExpired: '/page/transferPersonExpired',
  userSettings: '/page/userSettings',
};

const STATUS_ENUM = {
  ACCEPTED: 'accepted',
  ACCEPTED_FREE: 'accepted free',
  PENDING: 'pending',
  REFUSED: 'refused',
  UNCHANGED: 'unchanged',
  SUCCESS: 201,
  FORBIDDEN: 403,
  ERROR: 404,
  METHOD_NOT_ALLOWED: 405,
  ERROR_STRING: 'error',
  SUCCESS_STRING: 'success',
  UNAUTHORIZED: 401,
};

const PLAYER_ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

const PERSON_TRANSFER_STATUS_ENUM = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REFUSED: 'refused',
  CANCELED: 'canceled',
};

const FACEBOOK_STATUS_ENUM = {
  CONNECTED: 'connected',
  NOT_AUTHORIZED: 'not_authorized',
};

const BASIC_CHATBOT_STATES = {
  NOT_LINKED: 'not_linked',
  HOME: 'home',
};

const SCORE_SUBMISSION_CHATBOT_STATES = {
  SCORE_SUBMISSION_REQUEST_SENT: 'score_submission_request_sent',
  AWAITING_SCORE_SUBMISSION: 'awaiting_score_submission',
  AWAITING_SCORE_SUBMISSION_CONFIRMATION: 'awaiting_score_submission_confirmation',
  SPIRIT_SUBMISSION_REQUEST_SENT: 'spirit_submission_request_sent',
  AWAITING_SPIRIT_RULES: 'awaiting_spirit_rule',
  AWAITING_SPIRIT_FOULS: 'awaiting_spirit_fouls',
  AWAITING_SPIRIT_EQUITY: 'awaiting_spirit_equity',
  AWAITING_SPIRIT_SELF_CONTROL: 'awaiting_spirit_self_control',
  AWAITING_SPIRIT_COMMUNICATION: 'awaiting_spirit_communication',
  AWAITING_SPIRIT_CONFIRMATION: 'awaiting_spirit_confirmation',
  GAMES_AWAITING_SCORE_LIST: 'games_awaiting_score_list',
  AWAITING_ATTENDANCE: 'awaiting_attendance',
  OTHER_TEAM_SUBMITTED_A_SCORE: 'other_team_submitted_a_score',
};

const GAME_INFOS_CHATBOT_STATES = {
  NEXT_GAME_INFOS: 'next_games_infos',
};

const REJECTION_ENUM = {
  NO_REMAINING_SPOTS: 'no_remaining_spots',
  ALREADY_REGISTERED: 'already_registered',
  TOO_MANY_TEAMS: 'too_many_teams',
  LAST_TEAM_HIGHER_THAN_SPOTS: 'last_team_higher_than_spots',
};

const VIEW_ENUM = {
  MENU: 'menu',
  HOME: '',
  CART: 'cart',
  ORGANIZATION_LIST: 'organizationList',
};

const POSITION_ENUM = {
  BOTTOM: 'bottom',
  TOP: 'top',
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
};

const SEVERITY_ENUM = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

const SPIRIT_CATEGORY_ENUM = {
  RULES_KNOWLEDGE_AND_USE: 'rules_knowledge_and_use',
  FOULS_AND_BODY_CONTACT: 'fouls_and_body_contact',
  FAIR_MINDEDNESS: 'fair_mindedness',
  POSITIVE_ATTITUDE_AND_SELF_CONTROL: 'positive_attitude_and_self_control',
  COMMUNICATION: 'communication',
};

const LOGIN_STATE_ENUM = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT_PASSWORD: 'forgotPassword',
};

const GLOBAL_ENUM = {
  PERSON: 1,
  ORGANIZATION: 2,
  TEAM: 3,
  EVENT: 4,
  GAME: 5,
  MEMBERSHIP: 'membership',
  SHOP_ITEM: 'shop_item',
};

const SOCKET_EVENT = {
  CONNECTED_USER: 'connectedUser',
  NOTIFICATIONS: 'notifications',
};

const NOTIFICATION_TYPE = {
  ADDED_TO_ROSTER: 'added to roster',
  OTHER_TEAM_SUBMITTED_A_SCORE: 'other team submitted a score',
  SCORE_SUBMISSION_CONFLICT: 'score submission conflict',
  SCORE_SUBMISSION_REQUEST: 'score submission request',
};

const NOTIFICATION_MEDIA = {
  EMAIL: 'email',
  CHATBOT: 'chatbot',
};

const LIST_ITEM_ENUM = {
  APP_ITEM: 'app item',
  BANK_ACCOUNT: 'bank account',
  CART_ITEM: 'cart item',
  CART: 'cart',
  CREATE_ENTITY: 'create entity',
  CREDIT_CARD: 'credit card',
  EVENT_CREATOR: 'event creator',
  EVENT_PAYMENT_OPTION: 'event_payment_option',
  MEMBER: 'member',
  MEMBERSHIP_DETAIL: 'membership detail',
  MEMBER_IMPORT: 'member_import',
  MEMBERSHIP_ORGANIZATION: 'membership organization',
  MEMBERSHIP: 'membership',
  MEMBERSHIP_INFO: 'membership_info',
  MORE: 'more',
  PAYMENT_OPTION: 'payment option',
  PURCHASES: 'pruchases',
  RANKING_WITH_STATS: 'ranking with stats',
  RANKING: 'ranking',
  REPORT: 'report',
  ROSTER_ITEM: 'roster item',
  SALES: 'sales',
  SHOP_ITEM: 'shop item',
  AVATAR_TEXT_SKELETON: 'avatar and text',
  NOTIFICATION_SETTING: 'notification setting',
};

const MILLIS_TIME_ENUM = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 31 * 24 * 60 * 60 * 1000,
};

const LOGGER_ENUM = {
  STRIPE: '[STRIPE]',
};

const STRIPE_STATUS_ENUM = {
  DONE: 'done',
  NOT_DONE: 'not done',
};

const STRIPE_ERROR_ENUM = {
  CHARGE_ALREADY_REFUNDED: 'charge_already_refunded',
};
const IMAGE_ENUM = {
  ULTIMATE_TOURNAMENT:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73',
};

const LOGO_ENUM = {
  LOGO:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-a58ea-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_256X256:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200811-vtd7h-f2a5f90b-d617-4926-baa9-4a3a16c5c112',
  LOGO_512X512:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-eucvv-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_1024X1024:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_2048X2048:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-i7bue-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_57X57:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-r4zcx-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_72X72:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_76X76:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_114X114:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lkee6-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_120X120:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-yqd7g-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_144X144:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-e0ybp-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_152X152:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lgc7l-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_180X180:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yzkf-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-pldn3-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_57X57:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-rbjvk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_72X72:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-v1upk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_76X76:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-35snn-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_114X114:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-fnes3-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_120X120:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-j4x5y-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_144X144:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yog5-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_152X152:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-vefl9-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_180X180:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-klr71-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_256X256:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-klobq-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_512X512:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-74mhi-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_1024X1024:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-k12j1-8317ff33-3b04-49a1-afd3-420202cddf73',
};

const PARTENERS_LOGO_ENUM = {
  LA_RUCHE:
    'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-7ny96-60fb055c-a90c-48f6-aad4-e9bbdc115074',
  ESPACE_INC:
    'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-rhr3l-60fb055c-a90c-48f6-aad4-e9bbdc115074',
};

const PHOTO_ENUM = {
  JULIEN:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-vl29g-8317ff33-3b04-49a1-afd3-420202cddf73',
  ANDREANNE:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-0u6dg-8317ff33-3b04-49a1-afd3-420202cddf73',
  MEDERIC:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-6baar-8317ff33-3b04-49a1-afd3-420202cddf73',
  AUSTIN:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-ed5uo-8317ff33-3b04-49a1-afd3-420202cddf73',
  EMILIE:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-16nt5-8317ff33-3b04-49a1-afd3-420202cddf73',
  ACHILLE:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-mpeqg-8317ff33-3b04-49a1-afd3-420202cddf73',
  RANDOM_PLAYER:
    'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-p4spo-60fb055c-a90c-48f6-aad4-e9bbdc115074',
};

const MESSENGER_MESSAGES_EN = {
  CONNECTION_SUCCESS: {
    text:
      "You have been sign up to Sportfolios' chatbot successfuly! Come again after your next match to submit your scores",
    quick_replies: [
      {
        content_type: 'text',
        title: 'great! 🤩',
        payload: 'IGNORE',
      },
    ],
  },
  CONNECTION_ERROR: {
    text: 'There was an error while linking your account, please try again later',
  },
  GET_STARTED_NO_REF: {
    text:
      'You now need to link your Sportfolios account, please follow the following link: https://sportfolios.app/page/userSettings',
  },
};

const EVENT_TYPE = {
  PLAYER: 'player',
  TEAM: 'team',
};

module.exports = {
  APP_ENUM,
  BASIC_CHATBOT_STATES,
  CARD_TYPE_ENUM,
  DIRECTION_ENUM,
  COMPONENT_TYPE_ENUM,
  COUPON_CODE_ENUM,
  ENTITIES_ROLE_ENUM,
  FACEBOOK_STATUS_ENUM,
  FIELD_GROUP_ENUM,
  FORM_DIALOG_TYPE_ENUM,
  GAME_INFOS_CHATBOT_STATES,
  GENDER_ENUM,
  GLOBAL_ENUM,
  HEADER_FLYOUT_TYPE_ENUM,
  IMAGE_ENUM,
  INVOICE_STATUS_ENUM,
  LANGUAGE_ENUM,
  LIST_ITEM_ENUM,
  LOGGER_ENUM,
  LOGIN_STATE_ENUM,
  LOGO_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  MESSENGER_MESSAGES_EN,
  MILLIS_TIME_ENUM,
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  NOTIFICATION_MEDIA,
  NOTIFICATION_TYPE,
  PERSON_TRANSFER_STATUS_ENUM,
  PLATEFORM_FEES_PERCENTAGE,
  PLATEFORM_FEES_FIX,
  MIN_AMOUNT_FEES,
  PLAYER_ATTENDANCE_STATUS,
  POSITION_ENUM,
  REJECTION_ENUM,
  REPORT_TYPE_ENUM,
  ROSTER_ROLE_ENUM,
  PARTENERS_LOGO_ENUM,
  PHASE_STATUS_ENUM,
  PHOTO_ENUM,
  ROUTES_ENUM,
  SCORE_SUBMISSION_CHATBOT_STATES,
  SELECT_ENUM,
  SEVERITY_ENUM,
  SIZES_ENUM,
  SOCKET_EVENT,
  SPIRIT_CATEGORY_ENUM,
  STATUS_ENUM,
  STRIPE_ERROR_ENUM,
  STRIPE_STATUS_ENUM,
  TABS_ENUM,
  TAG_TYPE_ENUM,
  VIEW_ENUM,
  EVENT_TYPE,
};
