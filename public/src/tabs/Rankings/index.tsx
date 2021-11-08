import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/Custom';
import Typography from '@material-ui/core/Typography';
import { updateRanking } from './RankingFunctions';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';
import { getPreranking, getTeamgames } from '../../actions/service/entity/get';
import { IPhase, IPreranking, ISpiritRanking } from '../../../../typescript/event';
import { getEventRankings } from '../../actions/service/event';

const PhaseRanking = dynamic(() => import('./PhaseRanking'));
const Ranking = dynamic(() => import('./Ranking'));
const Preranking = dynamic(() => import('./Preranking'));
const SpiritRanking = dynamic(() => import('./SpiritRanking'));

const Rankings: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [preranking, setPreranking] = useState<IPreranking[]>([]);
  const [spiritRanking, setSpiritRanking] = useState<ISpiritRanking[]>(null);
  const [phases, setPhases] = useState<IPhase[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getRankings = async () => {
    const eventRankings = await getEventRankings(eventId);

    console.log({ eventRankings });
    setPreranking(eventRankings.prerank);
    setPhases(eventRankings.phases);
    setSpiritRanking(eventRankings.spirit);

    setIsLoading(false);

    return;

    const { preranking, prerankPhaseId } = await getPreranking(eventId);

    setPrerankPhaseId(prerankPhaseId);
    let ranking: IRanking[] = [];
    if (preranking) {
      ranking = preranking
        .map((d) => {
          if (d.rosterId) {
            return {
              position: d.position,
              name: d.name,
              rosterId: d.rosterId ? d.rosterId : null,
              rankingId: d.rankingId,
              teamId: d.teamId ? d.teamId : null,
            };
          }
        })
        .filter((d) => d !== undefined);
      setPreranking(
        ranking.map((r) => ({
          position: r.position,
          positionName: r.name,
          rosterId: r.rosterId,
          rankingId: r.rankingId,
          id: r.teamId,
        }))
      );
    }

    // const { spirit } = await getEventRankings(eventId);

    setSpiritRanking(spirit);

    const games = await getTeamgames(eventId);
    const playedGames = games.reduce((prev: any, curr: any) => {
      const score1 = curr.teams[0].score;
      const score2 = curr.teams[1].score;
      return prev.concat([score1, score2]);
    }, []);
    if (!playedGames.some((g: any) => g > 0)) {
      setRanking(ranking.sort((a, b) => a.position - b.position));
    } else {
      const rankingInfos = updateRanking(ranking, games);
      setRanking(rankingInfos);
    }
  };

  useEffect(() => {
    if (eventId) {
      getRankings();
    }
  }, [eventId]);

  console.log({ preranking });
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!preranking.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('no.no_teams_registered')}
      </Typography>
    );
  }

  return (
    <>
      <Preranking preranking={preranking} />
      {phases.map((phase) => (
        <PhaseRanking key={phase.id} phase={phase} />
      ))}
      {/* 
      <Ranking ranking={ranking} title={t('statistics')} withStats withoutPosition />
      <SpiritRanking spirit={spiritRanking} /> */}
    </>
  );
};
export default Rankings;
