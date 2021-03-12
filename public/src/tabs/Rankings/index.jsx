import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import { LoadingSpinner } from '../../components/Custom';
import Typography from '@material-ui/core/Typography';
import PhaseRankings from './PhaseRanking';
import Ranking from './Ranking';
import { updateRanking } from './RankingFunctions';
import { formatRoute } from '../../../common/utils/stringFormat';

export default function Rankings() {
  const router = useRouter();
  const { id: eventId } = router.query;
  const { t } = useTranslation();

  const [preRanking, setPreRanking] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRankings = async () => {
    const { data } = await api(
      formatRoute('/api/entity/preranking', null, {
        eventId,
      })
    );
    let ranking = [];
    if (data) {
      ranking = data.map((d) => ({
        position: d.initial_position,
        name: d.name,
        id: d.teamId,
      }));
      setPreRanking(ranking);
    }

    const { data: games } = await api(formatRoute('/api/entity/teamGames', null, { eventId }));

    games.map((game) => {
      const res1 = ranking.find((r) => game.teams[0].teamId === r.teamId);
      game.teams[0].position = res1.position;

      const res2 = ranking.find((r) => game.teams[1].teamId === r.teamId);
      game.teams[1].position = res2.position;
    });
    const rankingInfos = updateRanking(ranking, games);
    setRanking(rankingInfos);
    setIsLoading(false);
  };

  useEffect(() => {
    getRankings();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!preRanking.length && !ranking.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('no.no_teams_registered')}
      </Typography>
    );
  }
  return (
    <>
      <Ranking ranking={preRanking} title={t('preranking')}></Ranking>
      <PhaseRankings />
      <Ranking ranking={ranking} title={t('statistics')} withStats withoutPosition></Ranking>
    </>
  );
}
