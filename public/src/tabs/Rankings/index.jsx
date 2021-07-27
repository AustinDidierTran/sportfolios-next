import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import { LoadingSpinner } from '../../components/Custom';
import Typography from '@material-ui/core/Typography';
import { updateRanking } from './RankingFunctions';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';

const PhaseRanking = dynamic(() => import('./PhaseRanking'));
const Ranking = dynamic(() => import('./Ranking'));

export default function Rankings() {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [preranking, setPreranking] = useState([]);
  const [prerankPhaseId, setPrerankPhaseId] = useState();
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRankings = async () => {
    const {
      data: { preranking, prerankPhaseId },
    } = await api(
      formatRoute('/api/entity/preranking', null, {
        eventId,
      })
    );
    setPrerankPhaseId(prerankPhaseId);
    let ranking = [];
    if (preranking) {
      ranking = preranking
        .map((d) => {
          if (d.rosterId) {
            return {
              position: d.position,
              name: d.name,
              rosterId: d.rosterId ? d.rosterId : null,
              rankingId: d.rankingId,
              id: d.teamId ? d.teamId : null,
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

    const { data: games } = await api(formatRoute('/api/entity/teamGames', null, { eventId }));
    const playedGames = games.reduce((prev, curr) => {
      const score1 = curr.teams[0].score;
      const score2 = curr.teams[1].score;
      return prev.concat([score1, score2]);
    }, []);
    if (!playedGames.some((g) => g > 0)) {
      setRanking(ranking.sort((a, b) => a.position - b.position));
    } else {
      const rankingInfos = updateRanking(ranking, games);
      setRanking(rankingInfos);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      getRankings();
    }
  }, [eventId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!preranking.length && !ranking.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('no.no_teams_registered')}
      </Typography>
    );
  }

  return (
    <>
      <Ranking ranking={preranking} title={t('preranking')} />
      <PhaseRanking prerankPhaseId={prerankPhaseId} />
      <Ranking ranking={ranking} title={t('statistics')} withStats withoutPosition />
    </>
  );
}
