import React from 'react';
import AllGames from './AllGames';
import GameDetailed from './GameDetailed';
import { useRouter } from 'next/router';

export default function ScheduleTab() {
  const router = useRouter();
  const { game_id } = router.query;

  if (game_id) {
    return <GameDetailed />;
  }
  return <AllGames />;
}
