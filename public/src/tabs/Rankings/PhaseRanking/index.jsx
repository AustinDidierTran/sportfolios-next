import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
import { useTranslation } from 'react-i18next';

export default function PhaseRankings() {
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
          const ranking = phase.ranking
            .map((r) => ({ ...r, name: `${r.initial_position} - ${phase.name}` }))
            .sort((a, b) => a.initial_position - b.initial_position);
          return { ranking, title: `${phase.name} - ${t('phase_not_started')}`, status: phase.status };
        }
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
        const teams = allTeams.map((t) => {
          return { ...t, position: t.initial_position, id: t.teamId, rosterId: t.roster_id };
        });
        const ranking = updateRanking(teams, games);
        return {
          ranking,
          title:
            phase.status === PHASE_STATUS_ENUM.STARTED
              ? `${phase.name} - ${t('phase_in_progress')}`
              : `${phase.name} - ${t('phase_done')}`,
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
            <Ranking key={phase.id} ranking={phase.ranking} title={phase.title} withStats></Ranking>
          ) : (
            <Ranking key={phase.id} ranking={phase.ranking} title={phase.title} withStats={false}></Ranking>
          )}
        </div>
      ))}
    </>
  );
}
