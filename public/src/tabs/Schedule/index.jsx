import React from 'react';

import { useRouter } from 'next/router';
import loadable from '@loadable/component';

const AllGames = loadable(() => import('./AllGames'));
const GameDetailed = loadable(() => import('./GameDetailed'));

export default function ScheduleTab(props) {
  const router = useRouter();
  const { gameId } = router.query;
  const { basicInfos } = props;

  const [filter, setFilter] = React.useState();

  if (gameId) {
    return <GameDetailed gameId={gameId} basicInfos={basicInfos} />;
  }
  return <AllGames setFilter={setFilter} oldFilter={filter} />;
}
