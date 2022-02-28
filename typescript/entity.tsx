export enum EntityType {
  PERSON = '1',
  ORGANIZATION = '2',
  TEAM = '3',
  EVENT = '4',
}

export interface Entity {
  id: string;
  name: string;
  photoUrl: string;
  createdAt?: Date;
  verifiedAt?: Date;
  deletedAt?: Date;
  type?: number;
}

export interface Person extends Entity {
  surname: string;
}

export interface Team extends Entity {
  admins: Person[];
}

export interface Event extends Entity {
  creator: Organization;
  eventType: string;
  startDate: Date;
  admins?: Person[];
  endDate?: Date;
  maximumSpots?: number;
  ticketLimit?: number;
}

export interface ISpiritRanking {
  name: string;
  rosterId: string;
  spirit: number;
}

export interface IEventRankings {
  spirit: [ISpiritRanking];
}

export interface Organization extends Entity {
  admins: Person[];
}
