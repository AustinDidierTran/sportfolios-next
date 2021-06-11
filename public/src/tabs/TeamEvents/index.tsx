import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Practice } from '../../../../typescript/types';

const MyEventsTeam = dynamic(() => import('../../components/Custom/MyEventsTeam'));
const PracticeDetailed = dynamic(() => import('../../components/Custom/MyEventsTeam/PracticeDetailed'));

interface IProps {
  gamesInfos: IGameInfos[];
  practiceInfos: Practice[];
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
  const { gamesInfos, practiceInfos, adminView } = props;

  if (practiceId) {
    return <PracticeDetailed practiceId={practiceId.toString()} />;
  }
  return <MyEventsTeam gamesInfos={gamesInfos} practiceInfos={practiceInfos} adminView={adminView} />;
};
export default TabTeamEvents;
