import React from 'react';
import dynamic from 'next/dynamic';

const MyGamesTeam = dynamic(() => import('../../components/Custom/MyGamesTeam'));

export default function TabTeamEvents(props) {
  const { gamesInfos } = props;

  return <MyGamesTeam gamesInfos={gamesInfos} />;
}
