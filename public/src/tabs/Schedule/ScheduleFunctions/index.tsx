import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';
import { EventField, Phase, Ranking, TeamsSchedule, TimeSlot } from '../../../../../typescript/types';
import { getGameOptions as getGameOptionsApi } from '../../../actions/service/entity/get';

interface IData {
  value: string;
  display: string;
}

interface IWithAllData {
  value: string;
  displayKey?: string;
  display?: string;
}

interface IPhases extends IWithAllData {
  status?: string;
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

export const getPhases = (data: Phase[], withoutAll: boolean): IPhases[] => {
  if (data.length > 0) {
    const res = data
      .sort((a: Phase, b: Phase) => a.phaseOrder - b.phaseOrder)
      .map((d: Phase) => ({
        value: d.id,
        display: d.name,
        status: d.status,
      }));
    if (withoutAll) {
      return res;
    }
    return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
  }
};

export const getSlots = (data: TimeSlot[]): IData[] => {
  if (data.length > 0) {
    const res = data.map((d: TimeSlot) => ({
      value: d.id,
      display: formatDate(moment.utc(d.date), 'ddd DD MMM HH:mm'),
    }));
    return res;
  }
};

export const getFutureSlots = (data: TimeSlot[]): IData[] => {
  if (data.length > 0) {
    const res = data
      .filter((d: TimeSlot) => moment(d.date) >= moment())
      .map((d: TimeSlot) => ({
        value: d.id,
        display: formatDate(moment.utc(d.date), 'ddd DD MMM HH:mm'),
      }));
    return res;
  }
};

export const getTeams = (data: TeamsSchedule[], withoutAll: boolean): IWithAllData[] => {
  if (data.length > 0) {
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
  }
};

export const getFields = (data: EventField[], withoutAll: boolean): IWithAllData[] => {
  if (data.length > 0) {
    const res = data.map((d: EventField) => ({
      value: d.id,
      display: d.field,
    }));
    if (withoutAll) {
      return res;
    }
    return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
  }
};

export const getPositionOptions = (data: Phase[]): IPositionOption[] => {
  const rankingOptions = data.reduce((prev: Ranking[], curr: Phase) => {
    return prev.concat(curr.ranking);
  }, []);

  const formattedRankingOptions = rankingOptions.map((r: Ranking) => ({
    value: r.rankingId,
    display: r.name
      ? `${r.finalPosition ? r.finalPosition.toString() : r.initialPosition.toString()}. ${
          data.find((d: Phase) => d.id === r.currentPhase).name
        } (${r.name})`
      : `${r.initialPosition.toString()}. ${data.find((d) => d.id === r.currentPhase).name}`,
    ...r,
  }));
  return formattedRankingOptions.sort(
    (a: Ranking, b: Ranking) =>
      (a.finalPosition ? a.finalPosition : a.initialPosition) - (b.finalPosition ? b.finalPosition : b.initialPosition)
  );
};

export const getGameOptions = async (eventId: string, withoutAll: boolean, isFuture = false): Promise<GameOptions> => {
  const options = await getGameOptionsApi(eventId);
  let timeSlotsRes;
  if (isFuture) {
    timeSlotsRes = getFutureSlots(options.timeSlots);
  } else {
    timeSlotsRes = getSlots(options.timeSlots);
  }
  const teamRes = getTeams(options.teams, withoutAll);
  const phasesRes = getPhases(options.phases, withoutAll);
  const fieldsRes = getFields(options.fields, withoutAll);
  const positionsRes = getPositionOptions(options.phases);

  return {
    timeSlots: timeSlotsRes,
    teams: teamRes,
    phases: phasesRes,
    fields: fieldsRes,
    positions: positionsRes,
  };
};
