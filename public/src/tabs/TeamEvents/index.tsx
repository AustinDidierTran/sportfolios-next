import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Positions } from '../../../../typescript/types';

const MyEventsTeam = dynamic(() => import('../../components/Custom/MyEventsTeam'));
const PracticeDetailed = dynamic(() => import('../../components/Custom/MyEventsTeam/PracticeDetailed'));

interface IProps {
  gamesInfos: IGameInfos[];
  adminView: boolean;
  isAdmin: boolean
}

interface IGameInfos {
  eventId: string;
  eventName: string;
  id: string;
  timeslot: string;
  field: string;
  phaseName: string;
  teamNames: string;
  teamScores: string;
  positions: Positions;
  startTime: string;
}

const TabTeamEvents: React.FunctionComponent<IProps> = (props) => {
  const router = useRouter();
  const { practiceId } = router.query;
  const { gamesInfos, adminView, isAdmin } = props;

  if (practiceId) {
    return <PracticeDetailed isAdmin={isAdmin} practiceId={practiceId.toString()} />;
  }
  return <MyEventsTeam gamesInfos={gamesInfos} adminView={adminView} />;
};
export default TabTeamEvents;
