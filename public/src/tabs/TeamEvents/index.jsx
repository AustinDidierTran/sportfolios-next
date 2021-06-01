import React from 'react';
import dynamic from 'next/dynamic';

const MyEventsTeam = dynamic(() => import('../../components/Custom/MyEventsTeam'));

export default function TabTeamEvents(props) {
  const { gamesInfos, practiceInfos, adminView } = props;

  return <MyEventsTeam gamesInfos={gamesInfos} practiceInfos={practiceInfos} adminView={adminView} />;
}
