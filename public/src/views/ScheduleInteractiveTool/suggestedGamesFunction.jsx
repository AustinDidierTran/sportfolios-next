export const suggestGames = (allRankings, phases, games) => {
  let suggestedGames = [];
  const gamesWithRanking = games.map((g) => ({
    gameId: g.id,
    phaseId: g.phase_id,
    rankingId1: g.rankings[0].ranking_id,
    rankingId2: g.rankings[1].ranking_id,
  }));

  phases.map((p) => {
    const phaseGames = getSuggestedGamesForPhase(
      allRankings.filter((r) => r.current_phase === p.id),
      p,
      gamesWithRanking.filter((g) => g.phaseId === p.id)
    );
    suggestedGames = suggestedGames.concat(phaseGames);
  });
  return suggestedGames;
};

const getSuggestedGamesForPhase = (ranking, phase, gamesWithRanking) => {
  var unmatchedRankings = function (active, rest, suggestions) {
    if (!rest.length) {
      return;
    } else {
      rest.map((r) => {
        if (
          gamesWithRanking.some(
            (g) =>
              (g.rankingId1 === active.ranking_id && g.rankingId2 === r.ranking_id) ||
              (g.rankingId2 === active.ranking_id && g.rankingId1 === r.ranking_id)
          )
        ) {
          return;
        } else {
          suggestions.push({
            phaseId: phase.id,
            status: phase.status,
            rankings: [active, r],
          });
          return;
        }
      });
      unmatchedRankings(rest[0], rest.slice(1), suggestions);
    }
    return suggestions;
  };
  return unmatchedRankings(ranking[0], ranking.slice(1), []);
};
