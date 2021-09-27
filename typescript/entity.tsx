export interface Entity {
  id: string;
  name: string;
  photoUrl: string;
  deletedAt?: Date;
}

export interface Person extends Entity {
  surname: string;
}

export interface Team extends Entity {
  admins: Person[];
}

export interface Event extends Entity {
  admins: Person[];
  maximumSpots: number;
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
