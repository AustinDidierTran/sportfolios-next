export interface ISpiritRanking {
  name: string;
  rosterId: string;
  spirit: number;
}

export interface IEventRankings {
  spirit: [ISpiritRanking];
}
