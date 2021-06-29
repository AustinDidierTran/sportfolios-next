export const suggestGames = (allRankings, phases, games) => {
  let suggestedGames = [];
  const gamesWithRanking = games.map((g) => ({
    gameId: g.id,
    phaseId: g.phaseId,
    rankingId1: g.rankings[0].rankingId,
    rankingId2: g.rankings[1].rankingId,
  }));

  phases.map((p) => {
    const phaseGames = getSuggestedGamesForPhase(
      allRankings.filter((r) => r.currentPhase === p.id),
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
              (g.rankingId1 === active.rankingId && g.rankingId2 === r.rankingId) ||
              (g.rankingId2 === active.rankingId && g.rankingId1 === r.rankingId)
          )
        ) {
          return;
        } else {
          suggestions.push({
            phaseId: phase.id,
            status: phase.status,
            phaseName: phase.name,
            phaseOrder: phase.order ? phase.order : phase.phaseOrder,
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
