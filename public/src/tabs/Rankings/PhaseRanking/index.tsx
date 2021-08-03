import React, { useEffect, useState, useContext } from 'react';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
import { useTranslation } from 'react-i18next';
import { Store } from '../../../Store';
import { getPhases as getPhasesApi, getPhasesGameAndTeams } from '../../../actions/service/entity/get';
import { PhaseGames, Ranking as IRanking } from '../../../../../typescript/types';

interface IProps {
  prerankPhaseId: string;
}

interface IPhase {
  id: string;
  status: string;
  ranking: IRanking[];
  title: string;
  subtitle: string;
}

const PhaseRankings: React.FunctionComponent<IProps> = (props) => {
  const { prerankPhaseId } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);
  const { t } = useTranslation();

  const [phases, setPhases] = useState<any>([]);
  const [isTeamsScoreEqual, setIsTeamScoreEqual] = useState<boolean>(false);

  const getPhases = async (): Promise<void> => {
    const phases = await getPhasesApi(eventId);

    phases.sort((a, b) => a.phaseOrder - b.phaseOrder);

    const res = await Promise.all(
      phases.map(async (phase) => {
        if (phase.status === PHASE_STATUS_ENUM.NOT_STARTED) {
          const ranking = phase.ranking.map((r) => {
            if (r && r.rosterId) {
              if (r.originPhase === prerankPhaseId) {
                return {
                  ...r,
                  rankingId: r.rankingId,
                  positionName: `${r.originPosition}. ${t('preranking')}`,
                  name: r.name,
                };
              }
              return {
                ...r,
                rankingId: r.rankingId,
                positionName: `${r.originPosition}. ${r.phaseName}`,
                name: r.name,
              };
            }
            if (r && r.originPhase && r.originPosition) {
              return { ...r, rankingId: r.rankingId, positionName: `${r.originPosition}. ${r.phaseName}` };
            }
            return { ...r, rankingId: r.rankingId, name: t('no.no_team_yet') };
          });
          return { ranking, title: phase.name, subtitle: t('phase_not_started'), status: phase.status };
        }

        const { games, teams: allTeams } = await getPhasesGameAndTeams(eventId, phase.id);
        const teams = allTeams.map((team) => {
          let positionName = `${team.originPosition}. ${team.phaseName}`;
          if (team.originPhase === prerankPhaseId) {
            positionName = `${team.originPosition}. ${t('preranking')}`;
          }
          return {
            ...team,
            position: team.initialPosition,
            finalPosition: team.finalPosition,
            id: team.teamId,
            rosterId: team.rosterId,
            positionName,
          };
        });

        const ranking = updateRanking(teams, games);

        const rankingStats = ranking.map((r: IRanking) => {
          const t = teams.find((t) => t.id === r.id);
          return {
            ...r,
            positionName: t.positionName,
            finalPosition: t.finalPosition,
            initialPosition: t.initialPosition,
          };
        });

        if (phase.status === PHASE_STATUS_ENUM.DONE) {
          const rankingFromFinalPosition = rankingStats.sort(
            (a: IRanking, b: IRanking) => a.finalPosition - b.finalPosition
          );

          return {
            ranking: rankingFromFinalPosition,
            title: phase.name,
            subtitle: t('phase_done'),
            status: phase.status,
          };
        } else {
          const playedGames = games.reduce((prev: any[], curr: PhaseGames) => {
            const score1 = curr.teams[0].score;
            const score2 = curr.teams[1].score;
            return prev.concat([score1, score2]);
          }, []);

          console.log({ playedGames, isTeamsScoreEqual: !playedGames.some((g) => g > 0) });
          setIsTeamScoreEqual(!playedGames.some((g) => g > 0));
        }

        return {
          ranking: rankingStats,
          title: phase.name,
          subtitle: t('phase_in_progress'),
          status: phase.status,
        };
      })
    );
    setPhases(res);
  };
  console.log({ isTeamsScoreEqual });

  useEffect((): void => {
    if (eventId) {
      getPhases();
    }
  }, [eventId]);

  return (
    <>
      {phases.map((phase: IPhase, index: number) => (
        <div key={index}>
          {phase.ranking.length < 1 ? (
            <></>
          ) : phase.status !== PHASE_STATUS_ENUM.NOT_STARTED ? (
            <Ranking
              key={phase.id}
              ranking={phase.ranking}
              title={phase.title}
              subtitle={phase.subtitle}
              allTeamsEqual={isTeamsScoreEqual}
              withStats
            ></Ranking>
          ) : (
            <Ranking
              key={phase.id}
              ranking={phase.ranking}
              title={phase.title}
              subtitle={phase.subtitle}
              withStats={false}
            ></Ranking>
          )}
        </div>
      ))}
    </>
  );
};
export default PhaseRankings;
