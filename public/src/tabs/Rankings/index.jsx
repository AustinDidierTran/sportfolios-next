import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import { LoadingSpinner } from '../../components/Custom';
import Typography from '@material-ui/core/Typography';
import { updateRanking } from './RankingFunctions';
import { formatRoute } from '../../../common/utils/stringFormat';
import loadable from '@loadable/component';

const PhaseRanking = loadable(() => import('./PhaseRanking'));
const Ranking = loadable(() => import('./Ranking'));

export default function Rankings() {
  const router = useRouter();
  const { id: eventId } = router.query;
  const { t } = useTranslation();

  const [preranking, setPreranking] = useState([]);
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
      ranking = data.map((d) => {
        if(d.rosterId){
          return {
            position: d.position,
            name: d.name,
            rosterId: d.rosterId ? d.rosterId : null,
            rankingId: d.rankingId,
          }
        }
      }).filter(d => d!==undefined);
      setPreranking(ranking);
    }

    const { data: games } = await api(formatRoute('/api/entity/teamGames', null, { eventId }));
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
  if (!preranking.length && !ranking.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('no.no_teams_registered')}
      </Typography>
    );
  }
  return (
    <>
      <Ranking ranking={preranking} title={t('preranking')}></Ranking>
      <PhaseRanking />
      <Ranking ranking={ranking} title={t('statistics')} withStats withoutPosition></Ranking>
    </>
  );
}
