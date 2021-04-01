import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';

export const getAllOptions = async (eventId, phaseId, t) => {
  const { data } = await api(
    formatRoute('/api/entity/phases', null, {
      eventId,
    })
  );

  const {
    data: { preranking },
  } = await api(
    formatRoute('/api/entity/preranking', null, {
      eventId,
    })
  );

  const { data: prerankPhase } = await api(
    formatRoute('/api/entity/prerankPhase', null, {
      eventId,
    })
  );

  const allPhases = data
    .map((d) => ({
      content: d.name,
      phaseId: d.id,
      spots: d.spots,
      status: d.status,
      order: d.phase_order,
      ranking: d.ranking.map((r) => ({
        rosterId: r.roster_id,
        originPhase: r.origin_phase,
        originPosition: r.origin_position,
        currentPhase: r.current_phase,
        currentPhaseName: d.name,
        initialPosition: r.initial_position,
        finalPosition: r.final_position,
        rankingId: r.ranking_id,
        teamName: r.name,
        originPhaseName: r.phaseName,
      })),
    }))
    .sort((a, b) => a.order - b.order);

  const allRankings = allPhases.reduce((prev, curr) => {
    return prev.concat(curr.ranking);
  }, []);

  const prerankingOptions = getPrerankingOptions(preranking, allRankings, t);
  const rankingOptions = getRankingOptions(allRankings, allPhases, prerankPhase.phaseId, phaseId);

  const allOptions = prerankingOptions.concat(rankingOptions).sort((a, b) => {
    if (a.index && b.index && a.phaseId === b.phaseId) {
      return a.index - b.index;
    }
  });
  const placeholder = [{ value: 'selected', display: `${t('add.add_position')}...`, disabled: true }];
  const res = placeholder.concat(allOptions);
  return res;
};

const getPrerankingOptions = (preranking, allRankings, t) => {
  const prerankingPositions = preranking.map((d) => ({
    value: d.rankingId,
    display: d.noTeam
      ? `${d.position.toString()}. ${t('preranking')}`
      : `${d.position.toString()}. ${t('preranking')} (${d.name})`,
    phaseId: d.phaseId,
    index: d.position,
  }));

  const unavailablePrerankPositions = allRankings
    .filter((r) => r.originPhase && r.originPosition)
    .map((r) => {
      const unavailablePrerankPosition = prerankingPositions.find((p) => {
        if (p.phaseId === r.originPhase) {
          if (p.index === r.originPosition) {
            return p;
          }
        }
      });
      if (unavailablePrerankPosition) {
        return unavailablePrerankPosition.value;
      }
    })
    .filter((p) => p !== undefined);

  const filteredPositions = prerankingPositions.filter((p) => !unavailablePrerankPositions.includes(p.value));
  return filteredPositions;
};

const getRankingOptions = (allRankings, allPhases, prerankId, phaseId) => {
  const allPositions = allRankings
    .filter((r) => r.currentPhase !== phaseId)
    .map((r) => {
      let name;
      if (allPhases.find((p) => p.phaseId === r.currentPhase).status === PHASE_STATUS_ENUM.DONE) {
        name = `${r.finalPosition.toString()}. ${r.currentPhaseName} (${r.teamName})`;
      }
      return {
        display: name
          ? name
          : r.teamName
          ? `${r.initialPosition.toString()}. ${r.currentPhaseName} (${r.teamName})`
          : `${r.initialPosition.toString()}. ${r.currentPhaseName}`,
        value: r.rankingId,
        index: r.finalPosition ? r.finalPosition : r.initialPosition,
        phaseId: r.currentPhase,
      };
    })
    .filter((o) => o !== undefined);

  const unavailablePositions = allRankings
    .filter((r) => r.originPhase && r.originPosition && r.originPhase !== prerankId)
    .map((r) => {
      const unavailablePosition = allRankings.find((rank) => {
        if (rank.currentPhase === r.originPhase) {
          if (rank.finalPosition === r.originPosition) {
            return rank;
          }
          if (rank.initialPosition === r.originPosition && !rank.finalPosition) {
            return rank;
          }
        }
      });
      return unavailablePosition.rankingId;
    })
    .filter((r) => r !== undefined);

  const filteredPositions = allPositions.filter((p) => !unavailablePositions.includes(p.value));
  return filteredPositions;
};
