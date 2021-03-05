import React from 'react';
import AllGames from './AllGames';
import GameDetailed from './GameDetailed';
import { useRouter } from 'next/router';

export default function ScheduleTab(props) {
  const router = useRouter();
  const { gameId } = router.query;
  const { basicInfos } = props;

  if (gameId) {
    return <GameDetailed gameId={gameId} basicInfos={basicInfos} />;
  }
  return <AllGames />;
}
