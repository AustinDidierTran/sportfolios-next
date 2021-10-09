export interface Entity {
  id: string;
  name: string;
  photoUrl: string;
  verifiedAt?: Date;
  deletedAt?: Date;
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
