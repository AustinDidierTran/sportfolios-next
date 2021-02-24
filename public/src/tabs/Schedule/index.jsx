import React from 'react';
import AllGames from './AllGames';
import GameDetailed from './GameDetailed';
import { useRouter } from 'next/router';

export default function ScheduleTab() {
  const router = useRouter();
  const { gameId } = router.query;

  if (gameId) {
    return <GameDetailed />;
  }
  return <AllGames />;
}
