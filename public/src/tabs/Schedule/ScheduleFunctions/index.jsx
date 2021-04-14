import api from '../../../actions/api';
import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import { formatDate } from '../../../utils/stringFormats';
import { formatRoute } from '../../../../common/utils/stringFormat';

export const getPhases = async (eventId, withoutAll) => {
  const { data } = await api(formatRoute('/api/entity/phases', null, { eventId }));
  const res = data
    .sort((a, b) => a.phase_order - b.phase_order)
    .map((d) => ({
      value: d.id,
      display: d.name,
    }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getSlots = async (eventId) => {
  const { data } = await api(formatRoute('/api/entity/slots', null, { eventId }));
  const res = data.map((d) => ({
    value: d.id,
    display: formatDate(moment(d.date), 'ddd DD MMM HH:mm'),
  }));
  return res;
};

export const getFutureSlots = async (eventId) => {
  const { data } = await api(formatRoute('/api/entity/slots', null, { eventId }));
  const res = data
    .filter((d) => moment(d.date) >= moment())
    .map((d) => ({
      value: d.id,
      display: formatDate(moment(d.date), 'ddd DD MMM HH:mm'),
    }));
  return res;
};

export const getTeams = async (eventId, withoutAll) => {
  const { data } = await api(formatRoute('/api/entity/teamsSchedule', null, { eventId }));
  const res = data.map((d) => {
    return {
      value: d.roster_id,
      display: d.name,
    };
  });
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getFields = async (eventId, withoutAll) => {
  const { data } = await api(formatRoute('/api/entity/fields', null, { eventId }));
  const res = data.map((d) => ({
    value: d.id,
    display: d.field,
  }));
  if (withoutAll) {
    return res;
  }
  return [{ value: SELECT_ENUM.ALL, displayKey: 'all' }, ...res];
};

export const getPositionOptions = async (eventId) => {
  const { data } = await api(formatRoute('/api/entity/phases', null, { eventId }));
  const rankingOptions = data.reduce((prev, curr) => {
    return prev.concat(curr.ranking);
  }, []);

  const formattedRankingOptions = rankingOptions.map((r) => ({
    value: r.ranking_id,
    display: r.name
      ? `${r.final_position ? r.final_position.toString() : r.initial_position.toString()}. ${
          data.find((d) => d.id === r.current_phase).name
        } (${r.name})`
      : `${r.initial_position.toString()}. ${data.find((d) => d.id === r.current_phase).name}`,
    ...r,
  }));
  return formattedRankingOptions.sort(
    (a, b) =>
      (a.final_position ? a.final_position : a.initial_position) -
      (b.final_position ? b.final_position : b.initial_position)
  );
};

export const getFutureGameOptions = async (eventId, withoutAll) => {
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

export const getGameOptions = async (eventId, withoutAll) => {
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
