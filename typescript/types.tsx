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

export interface Cart {
  items: CartItems;
  total: CartTotal;
}

export interface CartItems {
  active: string;
  amount: string;
  description: string;
  id: string;
  label: string;
  metadata: string;
  quantity: number;
  selected: string;
  photoUrl: string;
  stripePriceId: string;
  striePriceMetadata: string;
  stripeProductId: string;
  userId: string;
  taxRates: string;
}

export interface CartTotal {
  total: number;
  subtotal: number;
  taxes: number;
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
  surname: string;
  name: string;
  type: number;
  photoUrl: string;
}

export interface Player {
  id: string;
  personId: string;
  teamId: string;
  role: RosterRole;
  name: string;
  photoUrl: string;
  rsvp?: string;
}

export interface PendingPlayer extends Player {
  status: string;
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

export interface Member {
  id: string;
  memberType: number;
  personId: string;
  expirationDate: string;
  status: InvoiceStatus;
  organizationId?: string;
  membershipId?: string;
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
  entityId?: string;
  membershipType?: MembershipType;
  length?: number;
  fixedDate?: string;
  price: number;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  stripePriceId?: string;
  taxRates?: string;
  transactionFees?: string;
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

export interface EventField {
  eventId: string;
  field: string;
  id: string;
}

export interface OwnedEvents extends Entity {
  type: number;
  cardType: number;
  eventId: string;
  photoUrl: string;
  startDate: string;
  endDate: string;
  quickDescription: string;
  description: string;
  location: string;
  name: string;
  createdAt: string;
  creator: Entity;
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
  ranking?: Ranking[];
}
export interface PhaseGameAndTeams {
  games: PhaseGames[];
  teams: PhaseTeams[];
}

export interface PhaseTeams {
  rosterId: string;
  originPhase: string;
  originPosition: number;
  currentPhase: string;
  initialPosition: number;
  finalPosition: number;
  rankingId: string;
  teamId: string;
  name: string;
  phaseName: string;
}

export interface PhaseGames {
  id: string;
  phaseId: string;
  eventId: string;
  teams: GameTeam[];
}

export interface Ranking {
  id: string;
  rosterId: string;
  originPhase: string;
  originPosition: string;
  currentPhase: string;
  initialPosition: number;
  finalPosition: number;
  rankingId: string;
  phaseName?: string;
  name?: string;
  teamName?: string;
}

export interface Game extends Entity {
  phaseId: string;
  eventId: string;
  timeSlotId: string;
  fieldId: string;
  teams: GameTeam[];
}

export interface Games {
  id: string;
  phaseId: string;
  eventId: string;
  description: string;
  entityId: string;
  notifiedStart: string;
  notifiedEnd: string;
  locationId: string;
  phaseName: string;
  positions: Positions[];
  field: string;
  fieldId: string;
  startTime: string;
  timeslotId?: string;
}

export interface GameTeam {
  id: string;
  gameId: string;
  rosterId: string;
  name: string;
  score: number;
  position?: number;
  spirit?: number;
  rankingId: string;
}

export interface GameInfo {
  id: string;
  gameId: string;
  phaseId: string;
  locationId: string;
  entityId: string;
  fieldId: string;
  timeslotId: string;
  eventId: string;
  description: string;
  notifiedStart?: string;
  notifiedEnd?: string;
  phaseName: string;
  positions: Positions[];
  scoreSubmited: string;
  field?: string;
  startTime: string;
  role: Role;
}

export interface Partner {
  id: string;
  name: string;
  website: string;
  description: string;
  photoUrl: string;
  organizationId?: string;
}

export interface Positions {
  id: string;
  gameId: string;
  rosterId: string;
  score: number;
  name: string;
  spirit: string;
  rankingId: string;
  position?: number;
  photoUrl?: string;
  teamName?: string;
}

export interface Practice {
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
  rsvp?: Rsvp[];
  myRsvp?: Rsvp[];
}

export interface Rsvp {
  name: string;
  photoUrl?: string;
  rsvp: string;
}

export interface Location {
  value?: string;
  display?: string;
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

export interface SubmissionerInfos {
  myTeam: SubmissionerTeam;
  enemyTeam: SubmissionerTeam;
  myAdminPersons: PersonAdmin[];
}

export interface SubmissionerTeam {
  rosterId: string;
  name: string;
}

export interface PersonAdmin {
  entityId: string;
  completeName: string;
}

export interface Tax {
  id: string;
  displayName: string;
  description: string;
  inclusive: boolean;
  active: boolean;
  percentage: number;
}

export interface TeamsSchedule {
  teamId: string;
  rosterId: string;
  eventId: string;
  name: string;
}
