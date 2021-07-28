import { TFunction } from 'react-i18next';
import { Phase, Preranking, Ranking } from '../../../../../typescript/types';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import { getPhases, getPreranking, getPrerankPhase } from '../../../actions/service/entity/get';

interface Options {
  value: string;
  display: string;
  phaseId: string;
  index: number;
  disabled?: boolean;
}

interface Placeholder {
  value: string;
  display: string;
  disabled?: boolean;
}

export const getAllOptions = async (
  eventId: string,
  phaseId: string,
  t: TFunction<'translation'>
): Promise<
  {
    value: string;
    display: string;
    disabled?: boolean;
  }[]
> => {
  const data = await getPhases(eventId);
  const { preranking } = await getPreranking(eventId);
  const prerankPhase = await getPrerankPhase(eventId);

  const allPhases = data
    .map((d) => ({
      content: d.name,
      phaseId: d.id,
      spots: d.spots,
      status: d.status,
      order: d.phaseOrder,
      ranking: d.ranking.map((r) => ({
        rosterId: r.rosterId,
        originPhase: r.originPhase,
        originPosition: r.originPosition,
        currentPhase: r.currentPhase,
        name: d.name,
        initialPosition: r.initialPosition,
        finalPosition: r.finalPosition,
        rankingId: r.rankingId,
        teamName: r.name,
      })),
    }))
    .sort((a, b) => a.order - b.order);

  const allRankings = allPhases.reduce((prev, curr) => {
    return prev.concat(curr.ranking);
  }, []);

  const prerankingOptions = getPrerankingOptions(preranking, allRankings, t);

  const rankingOptions = getRankingOptions(allRankings, allPhases, prerankPhase.phaseId, phaseId);

  const allOptions: Options[] = prerankingOptions.concat(rankingOptions).sort((a, b) => {
    if (a.index && b.index && a.phaseId === b.phaseId) {
      return Number(a.index) - Number(b.index);
    }
  });
  const placeholder: Placeholder[] = [{ value: 'selected', display: `${t('add.add_position')}...`, disabled: true }];
  const res = placeholder.concat(allOptions);
  return res;
};

const getPrerankingOptions = (preranking: Preranking[], allRankings: Ranking[], t: TFunction<'translation'>) => {
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
        if (p.phaseId === r.originPhase.id) {
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

const getRankingOptions = (allRankings: Ranking[], allPhases: Phase[], prerankId: string, phaseId: string) => {
  const allPositions = allRankings
    .filter((r) => r.currentPhase.id !== phaseId)
    .map((r) => {
      let name;
      if (allPhases.find((p) => p.phaseId === r.currentPhase.id).status === PHASE_STATUS_ENUM.DONE) {
        name = `${r.finalPosition.toString()}. ${r.currentPhase.name} (${r.teamName})`;
      }
      return {
        display: name
          ? name
          : r.teamName
          ? `${r.finalPosition ? r.finalPosition.toString() : r.initialPosition.toString()}. ${r.currentPhase.name} (${
              r.teamName
            })`
          : `${r.initialPosition.toString()}. ${r.currentPhase.name}`,
        value: r.rankingId,
        index: r.finalPosition ? r.finalPosition : r.initialPosition,
        phaseId: r.currentPhase.id,
      };
    })
    .filter((o) => o !== undefined);

  const unavailablePositions = allRankings
    .filter((r) => r.originPhase && r.originPosition && r.originPhase.id !== prerankId)
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
