import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const MyEventsTeam = dynamic(() => import('../../components/Custom/MyEventsTeam'));
const PracticeDetailed = dynamic(() => import('../../components/Custom/MyEventsTeam/PracticeDetailed'));

interface IProps {
  gamesInfos: IGameInfos[];
  adminView: boolean;
}

interface IGameInfos {
  eventId: string;
  eventName: string;
  id: string;
  timeslot: string;
  field: string;
  name: string;
  teamNames: string;
  teamScores: string;
}

const TabTeamEvents: React.FunctionComponent<IProps> = (props) => {
  const router = useRouter();
  const { practiceId } = router.query;
  const { gamesInfos, adminView } = props;

  if (practiceId) {
    return <PracticeDetailed practiceId={practiceId.toString()} />;
  }
  return <MyEventsTeam gamesInfos={gamesInfos} adminView={adminView} />;
};
export default TabTeamEvents;
