import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const MyEventsTeam = dynamic(() => import('../../components/Custom/MyEventsTeam'));
const PracticeDetailed = dynamic(() => import('../../components/Custom/MyEventsTeam/PracticeDetailed'));

export default function TabTeamEvents(props) {
  const router = useRouter();
  const { practiceId } = router.query;
  const { gamesInfos, practiceInfos, adminView } = props;

  if (practiceId) {
    return <PracticeDetailed practiceId={practiceId} adminView={adminView} />;
  }
  return <MyEventsTeam gamesInfos={gamesInfos} practiceInfos={practiceInfos} adminView={adminView} />;
}
