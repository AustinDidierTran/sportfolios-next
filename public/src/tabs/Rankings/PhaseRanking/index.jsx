import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';
import Ranking from '../Ranking';
import { updateRanking } from '../RankingFunctions';
export default function PhaseRankings() {
  const router = useRouter();
  const { id: eventId } = router.query;

  const [phases, setPhases] = useState([]);

  const getPhases = async () => {
    const { data: phases } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );
    const res = await Promise.all(
      phases.map(async (phase) => {
        const {
          data: { games, teams: allTeams },
        } = await api(
          formatRoute('/api/entity/phasesGameAndTeams', null, {
            eventId,
            phaseId: phase.id,
          })
        );
        let teams = [];
        let position = 1;
        games.forEach((g) => {
          if (!teams.filter((team) => team.id === g.teams[0].team_id).length) {
            teams.push({
              name: g.teams[0].name,
              roster_id: g.teams[0].roster_id,
              id: g.teams[0].team_id,
              position,
            });
            position = position + 1;
          }
          if (!teams.filter((team) => team.id === g.teams[1].team_id).length) {
            teams.push({
              name: g.teams[1].name,
              roster_id: g.teams[1].roster_id,
              id: g.teams[1].team_id,
              position,
            });
            position = position + 1;
          }
        });
        games.map((game) => {
          const res1 = teams.find((t) => game.teams[0].team_id === t.id);
          game.teams[0].position = res1.position;

          const res2 = teams.find((t) => game.teams[1].team_id === t.id);
          game.teams[1].position = res2.position;
        });
        allTeams.forEach((t) => {
          if (!teams.map((t) => t.id).includes(t.teamId)) {
            teams.push({ name: t.name, position: t.initial_position, roster_id: t.roster_id, id: t.teamId });
          }
        });

        const ranking = updateRanking(teams, games);
        return { ranking, title: phase.name };
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
        <Ranking key={index} ranking={phase.ranking} title={phase.title} withStats></Ranking>
      ))}
    </>
  );
}
