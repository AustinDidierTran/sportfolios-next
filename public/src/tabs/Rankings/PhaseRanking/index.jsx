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

        //   phase.ranking
        //     .map((r) => ({ ...r, name: `${r.initial_position}. ${phase.name}` }))
        //     .sort((a, b) => a.initial_position - b.initial_position);
        //   return { ranking, title: phase.name, subtitle: t('phase_not_started'), status: phase.status };
        // }

        const {
          data: { games, teams: allTeams },
        } = await api(
          formatRoute('/api/entity/phasesGameAndTeams', null, {
            eventId,
            phaseId: phase.id,
          })
        );
        // let teams = [];
        // let position = 1;
        // games.forEach((g) => {
        //   if (!teams.filter((team) => team.id === g.teams[0].team_id).length) {
        //     teams.push({
        //       name: g.teams[0].name,
        //       roster_id: g.teams[0].roster_id,
        //       id: g.teams[0].team_id,
        //       position,
        //     });
        //     position = position + 1;
        //   }
        //   if (!teams.filter((team) => team.id === g.teams[1].team_id).length) {
        //     teams.push({
        //       name: g.teams[1].name,
        //       roster_id: g.teams[1].roster_id,
        //       id: g.teams[1].team_id,
        //       position,
        //     });
        //     position = position + 1;
        //   }
        // });
        // games.map((game) => {
        //   const res1 = teams.find((t) => game.teams[0].team_id === t.id);
        //   game.teams[0].position = res1.position;

        //   const res2 = teams.find((t) => game.teams[1].team_id === t.id);
        //   game.teams[1].position = res2.position;
        // });
        // allTeams.forEach((t) => {
        //   if (!teams.map((t) => t.id).includes(t.teamId)) {
        //     teams.push({ name: t.name, position: t.initial_position, roster_id: t.roster_id, id: t.teamId });
        //   }
        // });
        const teams = allTeams.map((team) => {
          let positionName = `${team.origin_position}. ${team.phaseName}`;
          if (team.origin_phase === prerankPhaseId) {
            positionName = `${team.origin_position}. ${t('preranking')}`;
          }
          return { ...team, position: team.initial_position, id: team.teamId, rosterId: team.roster_id, positionName };
        });
        const ranking = updateRanking(teams, games);

        const rankingStats = ranking.map((r) => {
          const t = teams.find((t) => t.id === r.id);
          return { ...r, positionName: t.positionName };
        });

        return {
          ranking: rankingStats,
          title: phase.name,
          subtitle: phase.status === PHASE_STATUS_ENUM.STARTED ? t('phase_in_progress') : t('phase_done'),
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
