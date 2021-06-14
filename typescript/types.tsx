import { event } from 'react-ga';

//ENUMS
export enum Language {
  fr = 'fr',
  en = 'en',
}

export enum UserAppRole {
  admin = 1,
  user = 2,
}

export enum Role {
  admin = 1,
  editor = 2,
  viewer = 3,
}

export enum EntityType {
  person = 1,
  organization = 2,
  team = 3,
  event = 4,
  game = 5,
}

export enum MembershipType {
  elite = 1,
  competitive = 2,
  recreational = 3,
  junior = 4,
  notSpecified = 5,
}

export enum MembershipLength {
  fixed = 'fixed',
  length = 'length',
}

export enum Gender {
  male = 'Male',
  female = 'Female',
  notSpecified = 'Other',
}

export enum Notification {
  addedToRoster = 'added to roster',
  otherTeamSubmittedAScore = 'other team submitted a score',
  scoreSubmissionConflict = 'score submission conflict',
  scoreSubmissionRequest = 'score submission request',
}

export enum InvoiceStatus {
  draft = 'draft',
  deleted = 'deleted',
  free = 'free',
  open = 'open',
  paid = 'paid',
  refunded = 'refunded',
  uncollectible = 'uncollectible',
  void = 'void',
}

export enum Status {
  accepted = 'accepted',
  acceptedFree = 'accepted free',
  pending = 'pending',
  refused = 'refused',
  unchanged = 'unchanged',
}

export enum RosterRole {
  captain = 'captain',
  assistantCaptain = 'assistant-captain',
  coach = 'coach',
  player = 'player',
  viewer = 'viewer',
}

export enum PhaseStatus {
  notStarted = 'not_started',
  started = 'started',
  done = 'done',
}

//INTERFACES
export interface User {
  email: string;
  language: Language;
  userId: string;
  appRole?: UserAppRole;
  facebookId?: string;
  messengerId?: string;
  primaryPerson: Person;
  entities: EntityRole[];
  notifications: NotificationSetting[];
  creditCards?: CreditCard[];
  persons: Person[];
}

export interface NotificationSetting {
  type: Notification;
  email: boolean;
  chatbot: boolean;
}

export interface CreditCard {
  userId: string;
  customerId: string;
  informations: JSON;
  paymentMethodId: string;
  last4: string;
  isDefault: boolean;
}

export interface Entity {
  id: string;
  type: EntityType;
  role: Role;
  name: string;
  surname?: string;
  completeName?: string;
  description?: string;
  quickDescription?: string;
  photoUrl?: string;
  infosSuppId?: string;
  admins: EntityRole[];
  posts?: Post[];
}

export interface EntityRole {
  entityId: string;
  role: Role;
}

export interface Player {
  id: string;
  personId: string;
  teamId: string;
  role: RosterRole;
  name: string;
  photoUrl: string;
}

export interface Person extends Entity {
  birthDate?: string;
  phoneNumber?: string;
  gender?: Gender;
  emergencyName?: string;
  emergencySurname?: string;
  emergencyPhoneNumber?: string;
  medicalConditions?: string;
  addressId?: string;
}

export interface Address {
  id: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  personId: string;
  membershipId: string;
  type: MembershipType;
  status: InvoiceStatus;
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

export interface Organization extends Entity {
  memberships?: EntityMembership[];
  bankAccounts?: BankAccount[];
}

export interface EntityMembership {
  id: string;
  entityId: string;
  type: MembershipType;
  length?: MembershipLength;
  fixedDate?: string;
  price: number;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  stripePriceId?: string;
}

export interface BankAccount {
  accountId: string;
  bankAccountId: string;
  last4: string;
  isDefault: boolean;
}

export interface Event extends Entity {
  startDate: string;
  endDate?: string;
  maximumSpot?: number;
  alias?: string;
  fields?: Field[];
  timeSlots?: TimeSlot[];
  paymentOptions?: EventPaymentOption[];
  persons?: EventPerson[];
  teams?: EventTeam[];
  phases?: Phase[];
}

export interface EventPaymentOption {
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

export interface TimeSlot {
  id: string;
  eventId: string;
  date: string;
}

export interface Field {
  id: string;
  field: string;
  name: string;
}

export interface EventPerson {
  personId: string;
  eventId: string;
  status: InvoiceStatus;
  registrationStatus?: Status;
  invoiceItemId?: string;
  paymentOptionId?: string;
  informations?: string;
}

export interface EventTeam {
  rosterId: string;
  eventId: string;
  teamId: string;
  status: InvoiceStatus;
  registrationStatus: Status;
  invoiceItemId?: string;
  paymentOptionId?: string;
  informations?: string;
}

export interface Team extends Entity {
  rosters: Roster[];
}

export interface Roster {
  id: string;
  teamId: string;
  name: string;
  players?: TeamPlayer[];
}

export interface TeamPlayer {
  id: string;
  rosterId: string;
  personId: string;
  name: string;
  isSub: boolean;
  paymentStatus: Status;
  invoiceItemId?: string;
  role: RosterRole;
}

export interface Phase {
  id: string;
  name: string;
  eventId: string;
  spot?: number;
  phaseOrder: number;
  status: PhaseStatus;
  games?: Game[];
}

export interface Game extends Entity {
  phaseId: string;
  eventId: string;
  timeSlotId: string;
  fieldId: string;
  teams: GameTeam[];
}

export interface GameTeam {
  id: string;
  gameId: string;
  roserId: string;
  name: string;
  score: number;
  position?: number;
  spirit?: number;
  rankingId: string;
}

export interface Practice {
  entityId: string;
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  locationId?: string;
  addressFormatted?: string;
  teamId: string;
  roster: Player[];
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Location {
  value?:string;
  display?:string;
  id: string;
  location: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Post {
  id: string;
  name: string;
  surname: string;
  createdAt: string;
  entityId: string;
  photoUrl: string;
  content: string;
  locationId: string;
  liked?: boolean;
  likes: Like[];
  comments: Comment[];
  images: PostImage[];
}

export interface Like {
  entityId: string;
  postId: string;
}

export interface Comment {
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

export interface PostImage {
  postId: string;
  imageUrl: string;
}

export interface Tax {
  id: string;
  displayName: string;
  description: string;
  inclusive: boolean;
  active: boolean;
  percentage: number;
}
