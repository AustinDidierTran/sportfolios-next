export const MONTH_NAMES = [
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

export const MONTH_NAMES_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'june',
  'july',
  'aug',
  'sept',
  'oct',
  'nov',
  'dec',
];

export enum FIELD_GROUP_ENUM {
  ADD_PAYMENT_OPTION = 'add payment option',
}

export enum ENTITIES_ROLE_ENUM {
  ADMIN = 1,
  EDITOR = 2,
  VIEWER = 3,
}

export enum USER_APP_ROLE_ENUM {
  ADMIN = 1,
  USER = 2,
}

export enum APP_ENUM {
  FACEBOOK = 'Facebook',
  MESSENGER = 'Messenger',
  GOOGLE = 'Google',
  APPLE = 'Apple',
}

export enum SIZES_ENUM {
  XXXS = '3x-small',
  XXS = '2x-small',
  XS = 'x-small',
  SM = 'small',
  M = 'medium',
  L = 'large',
  XL = 'x-large',
  XXL = '2x-large',
  XXXL = '3x-large',
}

export enum COMPONENT_TYPE_ENUM {
  ADDRESS = 'address',
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  DIVIDER = 'divider',
  EMPTY = 'empty',
  EXERCISE = 'exercise',
  FILE_UPLOAD = 'file upload',
  IMAGE_UPLOAD = 'image upload',
  LINK = 'link',
  LIST_ITEM = 'list item',
  LIST = 'list',
  LOCATION = 'location',
  MULTISELECT = 'multiselect',
  PERSON_ITEM = 'person item',
  PERSON_SEARCH_LIST = 'person search list',
  PHONE_NUMBER = 'phone number',
  RADIO_GROUP = 'radio group',
  SELECT = 'select',
  TEXT_DOUBLE_BUTTON = 'text double button',
  TEXT_FIELD_BOX = 'text field box',
}

export enum PHASE_TYPE_ENUM {
  CUSTOM = 'custom',
  POOL = 'pool',
  ELIMINATION_BRACKET = 'elimination bracket',
}

export const ELIMINATION_BRACKET_SPOTS = [
  {
    display: '2',
    value: 2,
  },
  {
    display: '4',
    value: 4,
  },
  {
    display: '8',
    value: 8,
  },
  {
    display: '16',
    value: 16,
  },
  {
    display: '32',
    value: 32,
  },
];

export enum EXERCISES_TYPE_ENUM {
  DEFAULT = 'default',
  TIME = 'time',
  DISTANCE = 'distance',
  REPETITIONS = 'repetitions',
}

export enum ROSTER_ROLE_ENUM {
  CAPTAIN = 'captain',
  ASSISTANT_CAPTAIN = 'assistant-captain',
  COACH = 'coach',
  PLAYER = 'player',
  VIEWER = 'viewer',
}

export enum TAG_TYPE_ENUM {
  ACCEPTED = 'accepted',
  ACCEPTED_FREE = 'accepted free',
  PENDING = 'pending',
  REGISTERED = 'registered',
  UNREGISTERED = 'unregistered',
  DEFAULT = 'default',
}

export enum MEMBERSHIP_LENGTH_ENUM {
  ONE_MONTH = 1,
  SIX_MONTH = 2,
  ONE_YEAR = 3,
}
export enum MEMBERSHIP_LENGTH_TYPE_ENUM {
  FIXED = 'fixed',
  LENGTH = 'length',
}

export enum MEMBERSHIP_TYPE_ENUM {
  ELITE = 1,
  COMPETITIVE = 2,
  RECREATIONAL = 3,
  JUNIOR = 4,
  NOT_SPECIFIED = 5,
}

export enum PHASE_STATUS_ENUM {
  NOT_STARTED = 'not_started',
  STARTED = 'started',
  DONE = 'done',
}

export const PLATEFORM_FEES_PERCENTAGE = 0.059;
export const PLATEFORM_FEES_FIX = 0.3;
export const MIN_AMOUNT_FEES = 5;

export enum CARD_TYPE_ENUM {
  CART = 'cart',
  CART_SUMMARY = 'cart summary',
  DELETE_ENTITY = 'delete entity',
  EDITABLE_GAME = 'editable game',
  EVENT_SETTINGS = 'event settings',
  EVENT = 'event',
  GAME = 'game',
  PRACTICE = 'practice',
  INVOICE = 'invoice',
  POST = 'post',
  COMMENT = 'comment',
  REPORT = 'report',
  SCORE_SUGGESTION = 'score suggestion',
  SHOP = 'shop',
  TWO_TEAM_GAME_EDITABLE = 'twoTeamGameEditable',
  TWO_TEAM_GAME_PROFILE = 'twoTeamGameProfile',
  MULTIPLE_TEAM_GAME = 'MultipleTeamGame',
  ACCEPT_PLAYER_INFOS = 'accept player infos',
  ACCEPT_TEAM_INFOS = 'accept team infos',
  ACCEPT_TEAM_PLAYER = 'accept team player',
  OUR_TEAM_MEMBER = ' our team member',
}

export enum DIRECTION_ENUM {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum TABS_ENUM {
  ABOUT = 'about',
  CART = 'cart',
  COUPONS = 'coupons',
  EDIT_EVENTS = 'editEvents',
  EDIT_MEMBERSHIPS = 'editMemberships',
  EDIT_PERSON_INFOS = 'editPersonInfos',
  EDIT_RANKINGS = 'editRankings',
  EDIT_ROSTERS = 'editRosters',
  EDIT_SCHEDULE = 'editSchedule',
  EDIT = 'edit',
  EVENT_INFO = 'eventInfo',
  EVENTS = 'events',
  GENERAL = 'general',
  HOME = 'home',
  MEMBERSHIPS = 'memberships',
  PARTNERS = 'partners',
  PURCHASES = 'purchases',
  RANKINGS = 'rankings',
  RESULTS = 'results',
  ROSTERS = 'roster',
  SCHEDULE = 'schedule',
  SETTINGS = 'settings',
  SHOP = 'shop',
  TEAM_EVENTS = 'teamEvents',
  TEAM_ROSTERS = 'teamRosters',
  TICKETS = 'tickets',
  ADMIN_TICKETS = 'adminTickets',
}

export enum FORM_DIALOG_TYPE_ENUM {
  ADD_EVENT_PAYMENT_OPTION = 'add event payment option',
  ADD_FEE = 'add fee',
  ADD_MEMBER = 'add member',
  ADD_MEMBERSHIP = 'add membership',
  ADD_PARTNER = 'add partner',
  ADD_PLAYER = ' add player',
  ADD_ROSTER = ' add roster',
  BECOME_MEMBER_COUPON = 'become member coupon',
  BECOME_MEMBER = 'become member',
  CREATE_TAX_RATE = 'create tax rate',
  EDIT_EVENT_PAYMENT_OPTION = 'edit event payment option',
  EDIT_MEMBER_IMPORT = 'edit member import',
  EDIT_MEMBERSHIP_TERMS_AND_CONDITIONS = 'edit membership and conditions',
  EDIT_MEMBERSHIP = 'edit membership',
  EDIT_PARTNER = 'edit partner',
  EDIT_PLAYER = 'edit player',
  EDIT_ROSTER_PLAYER = 'edit roster player',
  EDIT_ROSTER = 'edit roster',
  ENTER_EMAIL = 'email',
  JOIN_TEAM = 'join team',
  MEMBERS_REPORT = 'members report',
  ROSTER_PLAYER_OPTIONS = 'roster player options',
  SALES_REPORT = 'sales_report',
  SUBMIT_SCORE_AND_SPIRIT = 'score and spirit',
  SUBMIT_SCORE = 'score',
}

export enum HEADER_FLYOUT_TYPE_ENUM {
  ACCOUNT = 'account',
  CLOSED = 'closed',
  CREATE = 'create.create',
  NOTIFICATIONS = 'notifications',
  PLUS = 'plus',
}

export enum REPORT_TYPE_ENUM {
  MEMBERS = 'members',
  SALES = 'sales',
}

export enum LANGUAGE_ENUM {
  ENGLISH = 'en',
  FRANCAIS = 'fr',
}

export enum SELECT_ENUM {
  ALL = 'all',
}

export enum GENDER_ENUM {
  MALE = 'Male',
  FEMALE = 'Female',
  NOT_SPECIFIED = 'Other',
}

export enum INVOICE_STATUS_ENUM {
  DRAFT = 'draft',
  DELETED = 'deleted',
  FREE = 'free',
  OPEN = 'open',
  PAID = 'paid',
  REFUNDED = 'refunded',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
}

export enum COUPON_CODE_ENUM {
  BECOME_MEMBER = 'become member',
}

export enum PILL_TYPE_ENUM {
  NOT_PAID = 'not paid',
  NOT_MEMBER = 'not member',
}

export enum ROUTES_ENUM {
  addBankAccount = '/page/addBankAccount',
  addPaymentMethod = '/page/addPaymentMethod',
  adminPanel = '/page/adminPanel',
  analytics = '/page/analytics',
  cart = '/page/cart',
  checkout = '/page/checkout',
  confirmationEmailSent = '/page/confirmationEmailSent/:email',
  confirmEmail = '/page/confirmEmail/:token',
  confirmEmailFailure = '/page/ConfirmEmailFailure',
  confirmEmailSuccess = '/page/confirmEmailSuccess',
  conversation = '/page/conversation/:convoId',
  conversations = '/page/conversation',
  createEvent = '/page/createEvent',
  createOrganization = '/page/createOrganization',
  createPerson = '/page/createPerson',
  createTeam = '/page/createTeam',
  entity = '/:id',
  entityNotFound = '/page/entityNotFound',
  eventRegistration = '/page/eventRegistration/:id',
  forgotPassword = '/page/forgotPassword',
  home = '/',
  importMembers = '/page/importMembers',
  landingPage = '/page/landingPage',
  login = '/page/login',
  loginEmail = '/page/login/email',
  membersList = '/page/membersList',
  menu = '/page/menu',
  newMessage = '/page/newMessage',
  mockEvent = '/page/mock/Event/:openTab',
  notifications = '/page/notifications',
  optionPayment = '/page/optionPayment/:id',
  orderProcessed = '/page/orderProcessed',
  organizationList = '/page/organizationList',
  passwordRecovery = '/page/passwordRecovery',
  paymentOptionStats = '/page/paymentOptionStats/:id',
  playersAcceptation = '/page/playersAcceptation/:id',
  privacyPolicy = '/page/privacy',
  productAddedToCart = '/page/productAddedToCart',
  recoveryEmail = '/page/recoveryEmail',
  redirectWithToken = '/page/redirect',
  registrationStatus = '/page/registrationStatus',
  resentValidationCode = '/page/resentValidationCode',
  rosterInviteLink = '/page/inviteRoster/:token',
  sales = '/page/sales/:id',
  scheduleInteractiveTool = '/page/scheduleInteractiveTool/:id',
  scheduleManager = '/page/scheduleManager',
  search = '/page/search',
  setupPrimaryPerson = '/page/setup/primaryPerson',
  shopDetails = '/page/shopDetails/:id/:stripePriceId',
  signup = '/page/signup',
  signupEmail = '/page/signup/email',
  signupEmailValidate = '/page/signup/email/validate',
  stripe = '/page/stripe',
  teamPlayersAcceptation = '/page/teamPlayersAcceptation/:id',
  teamsAcceptation = '/page/teamsAcceptation/:id',
  transferPerson = '/page/transferPerson/:token',
  transferPersonExpired = '/page/transferPersonExpired',
  userSettings = '/page/userSettings',
  userSettingsFacebook = '/page/userSettings/facebook',
  userSettingsGoogle = '/page/userSettings/google',
  validationAccount = '/page/validationAccount/:email',
  FAQ = 'page/FAQ',
}

export enum REQUEST_STATUS_ENUM {
  SUCCESS = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  ERROR = 404,
  METHOD_NOT_ALLOWED = 405,
}

export enum STATUS_ENUM {
  ACCEPTED = 'accepted',
  ACCEPTED_FREE = 'accepted free',
  ERROR_STRING = 'error',
  PENDING = 'pending',
  REFUSED = 'refused',
  SUCCESS_STRING = 'success',
  UNCHANGED = 'unchanged',
}

export enum PLAYER_ATTENDANCE_STATUS {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export enum SUBMISSION_ENUM {
  SCORE = 'score',
  SPIRIT = 'spirit',
}

export enum PERSON_TRANSFER_STATUS_ENUM {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REFUSED = 'refused',
  CANCELED = 'canceled',
}

export enum FACEBOOK_STATUS_ENUM {
  CONNECTED = 'connected',
  NOT_AUTHORIZED = 'not_authorized',
}

export enum BASIC_CHATBOT_STATES {
  NOT_LINKED = 'not_linked',
  HOME = 'home',
}

export enum SCORE_SUBMISSION_CHATBOT_STATES {
  SCORE_SUBMISSION_REQUEST_SENT = 'score_submission_request_sent',
  AWAITING_SCORE_SUBMISSION = 'awaiting_score_submission',
  AWAITING_SCORE_SUBMISSION_CONFIRMATION = 'awaiting_score_submission_confirmation',
  SPIRIT_SUBMISSION_REQUEST_SENT = 'spirit_submission_request_sent',
  AWAITING_SPIRIT_RULES = 'awaiting_spirit_rule',
  AWAITING_SPIRIT_FOULS = 'awaiting_spirit_fouls',
  AWAITING_SPIRIT_EQUITY = 'awaiting_spirit_equity',
  AWAITING_SPIRIT_SELF_CONTROL = 'awaiting_spirit_self_control',
  AWAITING_SPIRIT_COMMUNICATION = 'awaiting_spirit_communication',
  AWAITING_SPIRIT_CONFIRMATION = 'awaiting_spirit_confirmation',
  GAMES_AWAITING_SCORE_LIST = 'games_awaiting_score_list',
  AWAITING_ATTENDANCE = 'awaiting_attendance',
  OTHER_TEAM_SUBMITTED_A_SCORE = 'other_team_submitted_a_score',
}

export enum GAME_INFOS_CHATBOT_STATES {
  NEXT_GAME_INFOS = 'next_games_infos',
}

export enum REJECTION_ENUM {
  NO_REMAINING_SPOTS = 'no_remaining_spots',
  ALREADY_REGISTERED = 'already_registered',
  TOO_MANY_TEAMS = 'too_many_teams',
  LAST_TEAM_HIGHER_THAN_SPOTS = 'last_team_higher_than_spots',
  NO_PAYMENT_METHOD_SELECTED = 'no.no_payment_method_selected',
  NO_CART_ITEMS_SELECTED = 'no.no_cart_items_selected',
  CHECKOUT_ERROR = 'checkout_error',
  OTHER_GAMES_DEPENDS_ON_IT = 'other_games_depends_on_it',
}

export enum VIEW_ENUM {
  MENU = 'menu',
  HOME = '',
  CART = 'cart',
  ORGANIZATION_LIST = 'organizationList',
}

export enum POSITION_ENUM {
  BOTTOM = 'bottom',
  TOP = 'top',
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum SEVERITY_ENUM {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export enum SPIRIT_CATEGORY_ENUM {
  RULES_KNOWLEDGE_AND_USE = 'rules_knowledge_and_use',
  FOULS_AND_BODY_CONTACT = 'fouls_and_body_contact',
  FAIR_MINDEDNESS = 'fair_mindedness',
  POSITIVE_ATTITUDE_AND_SELF_CONTROL = 'positive_attitude_and_self_control',
  COMMUNICATION = 'communication',
}

export enum LOGIN_STATE_ENUM {
  LOGIN = 'login',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgotPassword',
}

export enum GLOBAL_ENUM {
  PERSON = 1,
  ORGANIZATION = 2,
  TEAM = 3,
  EVENT = 4,
  GAME = 5,
}

export enum CART_ITEM {
  MEMBERSHIP = 'membership',
  DONATION = 'donation',
  SHOP_ITEM = 'shop_item',
  EVENT_TICKET = 'event_ticket',
}

export enum SOCKET_EVENT {
  CONNECTED_USER = 'connectedUser',
  MESSAGES = 'messages',
  NOTIFICATIONS = 'notifications',
}

export enum NOTIFICATION_TYPE {
  ADDED_TO_EVENT = 'added to event',
  ADDED_TO_TEAM = 'added to team',
  REQUEST_TO_JOIN_TEAM = 'request to join team',
  OTHER_TEAM_SUBMITTED_A_SCORE = 'other team submitted a score',
  SCORE_SUBMISSION_CONFLICT = 'score submission conflict',
  SCORE_SUBMISSION_REQUEST = 'score submission request',
  PERSON_REGISTRATION = 'person registration',
  TEAM_REGISTRATION = 'team registration',
}

export enum NOTIFICATION_MEDIA {
  EMAIL = 'email',
  CHATBOT = 'chatbot',
  IN_APP = 'in app',
}

export enum LIST_ITEM_ENUM {
  APP_ITEM = 'app item',
  BANK_ACCOUNT = 'bank account',
  CART_ITEM = 'cart item',
  CART = 'cart',
  CREATE_ENTITY = 'create entity',
  CREDIT_CARD = 'credit card',
  EVENT_CREATOR = 'event creator',
  EVENT_PAYMENT_OPTION = 'event_payment_option',
  MEMBER = 'member',
  MEMBERSHIP_DETAIL = 'membership detail',
  MEMBER_IMPORT = 'member_import',
  MEMBERSHIP_ORGANIZATION = 'membership organization',
  MEMBERSHIP = 'membership',
  MEMBERSHIP_INFO = 'membership_info',
  MORE = 'more',
  PAYMENT_OPTION = 'payment option',
  PURCHASES = 'pruchases',
  RANKING_WITH_STATS = 'ranking with stats',
  RANKING = 'ranking',
  REPORT = 'report',
  ROSTER_ITEM = 'roster item',
  SALES = 'sales',
  SHOP_ITEM = 'shop item',
  AVATAR_TEXT_SKELETON = 'avatar and text',
  NOTIFICATION_SETTING = 'notification setting',
  PARTNER = 'partner',
}

export enum MILLIS_TIME_ENUM {
  ONE_MINUTE = 60 * 1000,
  ONE_HOUR = 60 * 60 * 1000,
  ONE_DAY = 24 * 60 * 60 * 1000,
  ONE_WEEK = 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH = 31 * 24 * 60 * 60 * 1000,
}

export enum LOGGER_ENUM {
  STRIPE = '[STRIPE]',
}

export enum STRIPE_STATUS_ENUM {
  DONE = 'done',
  NOT_DONE = 'not done',
}

export enum STRIPE_ERROR_ENUM {
  CHARGE_ALREADY_REFUNDED = 'charge_already_refunded',
}

export enum IMAGE_TYPE_ENUM {
  ALL = 'all',
  SOCCER = 'soccer',
  FRISBEE = 'frisbee',
  BASEBALL = 'baseball',
  VOLLEYBALL = 'volleyball',
}

export enum IMAGE_ENUM {
  ULTIMATE_TOURNAMENT = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200716-u8zhq-8317ff33-3b04-49a1-afd3-420202cddf73',
  SPORTFOLIOS_BANNER = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73',
}

export enum LOGO_ENUM {
  LOGO = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-a58ea-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_256X256 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200811-vtd7h-f2a5f90b-d617-4926-baa9-4a3a16c5c112',
  LOGO_512X512 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-eucvv-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_1024X1024 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73',
  LOGO_2048X2048 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-i7bue-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_57X57 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-r4zcx-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_72X72 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_76X76 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-tnlv3-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_114X114 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lkee6-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_120X120 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-yqd7g-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_144X144 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-e0ybp-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_152X152 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-lgc7l-8317ff33-3b04-49a1-afd3-420202cddf73',
  ICON_180X180 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yzkf-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-pldn3-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_57X57 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-rbjvk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_72X72 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-v1upk-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_76X76 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-35snn-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_114X114 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-fnes3-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_120X120 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-j4x5y-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_144X144 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-3yog5-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_152X152 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-vefl9-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_180X180 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20200724-klr71-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_256X256 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-klobq-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_512X512 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-74mhi-8317ff33-3b04-49a1-afd3-420202cddf73',
  WHITE_LOGO_1024X1024 = 'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210215-k12j1-8317ff33-3b04-49a1-afd3-420202cddf73',
}

export enum PARTENERS_LOGO_ENUM {
  LA_RUCHE = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-7ny96-60fb055c-a90c-48f6-aad4-e9bbdc115074',
  ESPACE_INC = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-rhr3l-60fb055c-a90c-48f6-aad4-e9bbdc115074',
}

export enum PHOTO_ENUM {
  JULIEN = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-89ehe-2850fc27-60b3-4508-93d1-56b454c9edf0',
  PIERRE_ETIENNE = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-7t73z-2850fc27-60b3-4508-93d1-56b454c9edf0',
  WILLIAM = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-980rp-2850fc27-60b3-4508-93d1-56b454c9edf0',
  AUSTIN = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-ru0rh-2850fc27-60b3-4508-93d1-56b454c9edf0',
  EMILIE = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-n4rs6-2850fc27-60b3-4508-93d1-56b454c9edf0',
  REMI = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-dvoeb-2850fc27-60b3-4508-93d1-56b454c9edf0',
  MAXIME = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210511-ihjx9-2850fc27-60b3-4508-93d1-56b454c9edf0',
  RANDOM_PLAYER = 'https://sportfolios-images.s3.amazonaws.com/production/images/entity/20210331-p4spo-60fb055c-a90c-48f6-aad4-e9bbdc115074',
}

export const MESSENGER_MESSAGES_EN = {
  CONNECTION_SUCCESS: {
    text: "You have been signed up to Sportfolios' chatbot successfully! Come again after your next match to submit your scores",
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
    text: 'You now need to link your Sportfolios account, please click on the following link: https://sportfolios.app/page/userSettings',
  },
};

export enum EVENT_TYPE {
  PICK_UP_LEAGUE = 'player',
  TEAM_LEAGUE = 'team',
  TEAM_TOURNAMENT = 'teamTournament',
  GAME = 'game',
}

export enum AuthErrorTypes {
  NoConfig = 'noConfig',
  MissingAuthConfig = 'missingAuthConfig',
  EmptyUsername = 'emptyUsername',
  InvalidUsername = 'invalidUsername',
  EmptyPassword = 'emptyPassword',
  EmptyCode = 'emptyCode',
  SignUpError = 'signUpError',
  NoMFA = 'noMFA',
  InvalidMFA = 'invalidMFA',
  EmptyChallengeResponse = 'emptyChallengeResponse',
  NoUserSession = 'noUserSession',
  Default = 'default',
  DeviceConfig = 'deviceConfig',
  NetworkError = 'networkError',
  NewPasswordRequired = 'NEW_PASSWORD_REQUIRED',
  NotAuthorizedException = 'NotAuthorizedException',
}

export enum ERROR_ENUM {
  ERROR_OCCURED = 'error_occured',
}
