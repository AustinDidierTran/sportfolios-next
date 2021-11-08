import { PHASE_STATUS_ENUM } from '../public/common/enums';
import { Team } from './entity';

export interface IOriginPhase {
  position: number;
}

export interface IPhaseRanking {
  id: string;
  rosterId: string;

  initialPosition: number;

  finalPosition: number;

  win: number;
  lose: number;
  ties: number;

  pointFor: number;
  pointAgainst: number;
  team: Team;
}

export interface IPreranking {
  id: string;
  team: Team;
  position: number;
}

export interface IPhase {
  id: string;
  name: string;
  order: number;
  rankings: IPhaseRanking[];
  spots: number;
  status: PHASE_STATUS_ENUM;
  type: string;
}

export interface ISpiritRanking {
  name: string;
  rosterId: string;
  spirit: number;
}

export interface IEventRankings {
  phases: IPhase[];
  prerank: IPreranking[];
  spirit: ISpiritRanking[];
}
