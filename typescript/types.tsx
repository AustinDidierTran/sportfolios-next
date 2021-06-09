import { event } from 'react-ga';

//ENUMS
export enum language {
  fr = 'fr',
  en = 'en',
}

export enum userAppRole {
  admin = 1,
  user = 2,
}

export enum role {
  admin = 1,
  editor = 2,
  viewer = 3,
}

export enum entityType {
  person = 1,
  organization = 2,
  team = 3,
  event = 4,
  game = 5,
}

export enum membershipType {
  elite = 1,
  competitive = 2,
  recreational = 3,
  junior = 4,
  notSpecified = 5,
}

export enum membershipLength {
  fixed = 'fixed',
  length = 'length',
}

export enum gender {
  male = 'Male',
  female = 'Female',
  notSpecified = 'Other',
}

export enum notification {
  addedToRoster = 'added to roster',
  otherTeamSubmittedAScore = 'other team submitted a score',
  scoreSubmissionConflict = 'score submission conflict',
  scoreSubmissionRequest = 'score submission request',
}

export enum invoiceStatus {
  draft = 'draft',
  deleted = 'deleted',
  free = 'free',
  open = 'open',
  paid = 'paid',
  refunded = 'refunded',
  uncollectible = 'uncollectible',
  void = 'void',
}

export enum status {
  accepted = 'accepted',
  acceptedFree = 'accepted free',
  pending = 'pending',
  refused = 'refused',
  unchanged = 'unchanged',
}

export enum rosterRole {
  captain = 'captain',
  assistantCaptain = 'assistant-captain',
  coach = 'coach',
  player = 'player',
  viewer = 'viewer',
}

export enum phaseStatus {
  notStarted = 'not_started',
  started = 'started',
  done = 'done',
}

//INTERFACES
export interface user {
  email: string;
  language: language;
  userId: string;
  appRole?: userAppRole;
  facebookId?: string;
  messengerId?: string;
  primaryPerson: person;
  entities: entityRole[];
  notifications: notificationSetting[];
  creditCards?: creditCard[];
  persons: person[];
}

export interface notificationSetting {
  type: notification;
  email: boolean;
  chatbot: boolean;
}

export interface creditCard {
  userId: string;
  customerId: string;
  informations: JSON;
  paymentMethodId: string;
  last4: string;
  isDefault: boolean;
}

export interface entity {
  id: string;
  type: entityType;
  name: string;
  role: role;
  surname?: string;
  description?: string;
  quickDescription?: string;
  photoUrl?: string;
  infosSuppId?: string;
  admins: entityRole[];
  posts?: post[];
}

export interface entityRole {
  entityId: string;
  role: role;
}

export interface player {
  id: string;
  personId: string;
  teamId: string;
  role: rosterRole;
  name: string;
  photoUrl: string;
}

export interface person extends entity {
  personId: string;
  birthDate?: string;
  phoneNumber?: string;
  gender?: gender;
  emergencyName?: string;
  emergencySurname?: string;
  emergencyPhoneNumber?: string;
  medicalConditions?: string;
  addressId?: string;
}

export interface address {
  id: string;
  streetAdress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface membership {
  id: string;
  organizationId: string;
  personId: string;
  membershipId: string;
  type: membershipType;
  status: invoiceStatus;
  invoiceItemId: string;
  paidOn: string;
  expirationDate: string;
  heardOrganization?: string;
  frequentedSchool?: string;
  jobTitle?: string;
  employer?: string;
  gettingInvolved?: string;
  infosSuppId: string;
  addressId?: string;
}

export interface organization extends entity {
  memberships?: entityMembership[];
  bankAccounts?: bankAccount[];
}

export interface entityMembership {
  id: string;
  entityId: string;
  type: membershipType;
  length?: membershipLength;
  fixedDate?: string;
  price: number;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  stripePriceId?: string;
}

export interface bankAccount {
  accountId: string;
  bankAccountId: string;
  last4: string;
  isDefault: boolean;
}

export interface event extends entity {
  startDate: string;
  endDate?: string;
  maximumSpot?: number;
  alias?: string;
  fields?: field[];
  timeSlots?: timeSlot[];
  paymentOptions?: eventPaymentOption[];
  persons?: eventPerson[];
  teams?: eventTeam[];
  phases?: phase[];
}

export interface eventPaymentOption {
  id: string;
  eventId: string;
  name: string;
  teamPrice?: number;
  teamStripePriceId?: string;
  individualPrice?: number;
  individualStripePriceId?: string;
  startTime: string;
  endTime: string;
  teamActivity: boolean;
  teamAcceptation: boolean;
  playerAcceptation: boolean;
  informations?: string;
}

export interface timeSlot {
  id: string;
  eventId: string;
  date: string;
}

export interface field {
  id: string;
  field: string;
  name: string;
}

export interface eventPerson {
  personId: string;
  eventId: string;
  status: invoiceStatus;
  registrationStatus?: status;
  invoiceItemId?: string;
  paymentOptionId?: string;
  informations?: string;
}

export interface eventTeam {
  rosterId: string;
  eventId: string;
  teamId: string;
  status: invoiceStatus;
  registrationStatus: status;
  invoiceItemId?: string;
  paymentOptionId?: string;
  informations?: string;
}

export interface team extends entity {
  rosters: roster[];
}

export interface roster {
  id: string;
  teamId: string;
  name: string;
  players?: teamPlayer[];
}

export interface teamPlayer {
  id: string;
  rosterId: string;
  personId: string;
  name: string;
  isSub: boolean;
  paymentStatus: status;
  invoiceItemId?: string;
  role: rosterRole;
}

export interface phase {
  id: string;
  name: string;
  eventId: string;
  spot?: number;
  phaseOrder: number;
  status: phaseStatus;
  games?: game[];
}

export interface game extends entity {
  phaseId: string;
  eventId: string;
  timeSlotId: string;
  fieldId: string;
  teams: gameTeam[];
}

export interface gameTeam {
  id: string;
  gameId: string;
  roserId: string;
  name: string;
  score: number;
  position?: number;
  spirit?: number;
  rankingId: string;
}

export interface practice {
  entityId: string;
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  addressFormatted?: string;
  teamId: string;
  roster: player[];
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface post {
  id: string;
  name: string;
  surname: string;
  createdAt: string;
  entityId: string;
  photoUrl: string;
  content: string;
  locationId: string;
  liked?: boolean;
  likes: like[];
  comments: comment[];
  images: postImage[];
}

export interface like {
  entityId: string;
  postId: string;
}

export interface comment {
  id: string;
  postId: string;
  entityId: string;
  content: string;
  name: string;
  surname: string;
  photoUrl: string;
  createdAt: string;
  parentId?: string;
}

export interface postImage {
  postId: string;
  imageUrl: string;
}

export interface tax {
  id: string;
  displayName: string;
  description: string;
  inclusive: boolean;
  active: boolean;
  percentage: number;
}
