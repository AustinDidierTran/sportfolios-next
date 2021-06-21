import api from '../../../actions/api';
import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';
import { formatRoute } from '../../../utils/stringFormats';
import { EventField, Phase, Ranking, TeamsSchedule, TimeSlot } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

interface IData {
  value: string;
  display: string;
}

interface IWithAllData {
  value: string;
  displayKey?: string;
  display: string;
}

interface IPhases extends IWithAllData {
  status: string;
}

interface GameOptions {
  timeSlots: IData[];
  teams: IWithAllData[];
  phases: IPhases[];
  fields: IWithAllData[];
  positions: IPositionOption[];
}

interface IPositionOption {
  value: string;
  display: string;
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

export const getPhases = async (eventId: string, withoutAll: boolean): Promise<IPhases[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/phases`, null, { eventId }));
  const res = data
    .sort((a:Phase, b:Phase) => a.phaseOrder - b.phaseOrder)
    .map((d:Phase) => ({
      value: d.id,
      display: d.name,
      status: d.status,
    }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getSlots = async (eventId: string): Promise<IData[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/slots`, null, { eventId }));
  const res = data.map((d: TimeSlot) => ({
    value: d.id,
    display: formatDate(moment.utc(d.date), 'ddd DD MMM HH:mm'),
  }));
  return res;
};

export const getFutureSlots = async (eventId: string): Promise<IData[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/slots`, null, { eventId }));
  const res = data
    .filter((d: TimeSlot) => moment(d.date) >= moment())
    .map((d: TimeSlot) => ({
      value: d.id,
      display: formatDate(moment.utc(d.date), 'ddd DD MMM HH:mm'),
    }));
  return res;
};

export const getTeams = async (eventId: string, withoutAll: boolean): Promise<IWithAllData[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/teamsSchedule`, null, { eventId }));
  const res = data.map((d: TeamsSchedule) => {
    return {
      value: d.rosterId,
      display: d.name,
    };
  });
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getFields = async (eventId: string, withoutAll: boolean): Promise<IWithAllData[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/fields`, null, { eventId }));
  const res = data.map((d:EventField) => ({
    value: d.id,
    display: d.field,
  }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getPositionOptions = async (eventId: string): Promise<IPositionOption[]> => {
  const { data } = await api(formatRoute(`${BASE_URL}/phases`, null, { eventId }));
  const rankingOptions = data.reduce((prev:Ranking[], curr:Phase) => {
    return prev.concat(curr.ranking);
  }, []);

  const formattedRankingOptions = rankingOptions.map((r:Ranking) => ({
    value: r.rankingId,
    display: r.name
      ? `${r.finalPosition ? r.finalPosition.toString() : r.initialPosition.toString()}. ${
          data.find((d:Phase) => d.id === r.currentPhase).name
        } (${r.name})`
      : `${r.initialPosition.toString()}. ${data.find((d:Ranking) => d.id === r.currentPhase).name}`,
    ...r,
  }));
  return formattedRankingOptions.sort(
    (a:Ranking, b:Ranking) =>
      (a.finalPosition ? a.finalPosition : a.initialPosition) -
      (b.finalPosition ? b.finalPosition : b.initialPosition)
  );
};

export const getFutureGameOptions = async (eventId: string, withoutAll: boolean): Promise<GameOptions>  => {
  const res = await Promise.all([
    getFutureSlots(eventId),
    getTeams(eventId, withoutAll),
    getPhases(eventId, withoutAll),
    getFields(eventId, withoutAll),
    getPositionOptions(eventId),
  ]);
  return {
    timeSlots: res[0],
    teams: res[1],
    phases: res[2],
    fields: res[3],
    positions: res[4],
  };
};

export const getGameOptions = async (eventId: string, withoutAll: boolean): Promise<GameOptions>  => {
  const res = await Promise.all([
    getSlots(eventId),
    getTeams(eventId, withoutAll),
    getPhases(eventId, withoutAll),
    getFields(eventId, withoutAll),
    getPositionOptions(eventId),
  ]);
  return {
    timeSlots: res[0],
    teams: res[1],
    phases: res[2],
    fields: res[3],
    positions: res[4],
  };
};
