import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
import { useTranslation } from 'react-i18next';

export default function PhaseRankings(props) {
  const { prerankPhaseId } = props;
  const router = useRouter();
  const { id: eventId } = router.query;
  const { t } = useTranslation();

  const [phases, setPhases] = useState([]);
  const [isTeamsScoreEqual, setIsTeamScoreEqual] = useState(false);

  const getPhases = async () => {
    const { data: phases } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );
    phases.sort((a, b) => a.phase_order - b.phase_order);
    const res = await Promise.all(
      phases.map(async (phase) => {
        if (phase.status === PHASE_STATUS_ENUM.NOT_STARTED) {
          const ranking = phase.ranking.map((r) => {
            if (r && r.roster_id) {
              if (r.origin_phase === prerankPhaseId) {
                return {
                  ...r,
                  rankingId: r.ranking_id,
                  positionName: `${r.origin_position}. ${t('preranking')}`,
                  name: r.name,
                };
              }
              return {
                ...r,
                rankingId: r.ranking_id,
                positionName: `${r.origin_position}. ${r.phaseName}`,
                name: r.name,
              };
            }
            if (r && r.origin_phase && r.origin_position) {
              return { ...r, rankingId: r.ranking_id, positionName: `${r.origin_position}. ${r.phaseName}` };
            }
            return { ...r, rankingId: r.ranking_id, name: t('no.no_team_yet') };
          });
          return { ranking, title: phase.name, subtitle: t('phase_not_started'), status: phase.status };
        }
        const {
          data: { games, teams: allTeams },
        } = await api(
          formatRoute('/api/entity/phasesGameAndTeams', null, {
            eventId,
            phaseId: phase.id,
          })
        );
        const teams = allTeams.map((team) => {
          let positionName = `${team.origin_position}. ${team.phaseName}`;
          if (team.origin_phase === prerankPhaseId) {
            positionName = `${team.origin_position}. ${t('preranking')}`;
          }
          return {
            ...team,
            position: team.initial_position,
            finalPosition: team.final_position,
            id: team.teamId,
            rosterId: team.roster_id,
            positionName,
          };
        });
        const ranking = updateRanking(teams, games);

        const rankingStats = ranking.map((r) => {
          const t = teams.find((t) => t.id === r.id);
          return {
            ...r,
            positionName: t.positionName,
            finalPosition: t.finalPosition,
            initialPosition: t.initial_position,
          };
        });

        if (phase.status === PHASE_STATUS_ENUM.DONE) {
          const rankingFromFinalPosition = rankingStats.sort((a, b) => a.finalPosition - b.finalPosition);
          return {
            ranking: rankingFromFinalPosition,
            title: phase.name,
            subtitle: t('phase_done'),
            status: phase.status,
          };
        } else {
          const playedGames = games.reduce((prev, curr) => {
            const score1 = curr.teams[0].score;
            const score2 = curr.teams[1].score;
            return prev.concat([score1, score2]);
          }, []);
          if (!playedGames.some((g) => g > 0)) {
            setIsTeamScoreEqual(true);
          }
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

  useEffect(() => {
    getPhases();
  }, []);

  return (
    <>
      {phases.map((phase, index) => (
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
}
