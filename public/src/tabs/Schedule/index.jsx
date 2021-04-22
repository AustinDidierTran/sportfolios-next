import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const AllGames = dynamic(() => import('./AllGames'));
const GameDetailed = dynamic(() => import('./GameDetailed'));

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
