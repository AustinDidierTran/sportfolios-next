import { Entity } from './entity';

export interface ISpiritRanking {
  name: string;
  rosterId: string;
  spirit: number;
}

export interface IEventRankings {
  spirit: [ISpiritRanking];
}

export interface EventPost {
  cartType: string;
  createdAt: Date;
  creator: Entity;
  description: string;
  endDate: Date;
  eventId: string;
  name: string;
  photoUrl: string;
  quickDescription: string;
  startDate: Date;
  type: string;
}
