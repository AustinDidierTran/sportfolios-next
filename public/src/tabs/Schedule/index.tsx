import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Entity } from '../../../../typescript/types';

const AllGames = dynamic(() => import('./AllGames'));
const GameDetailed = dynamic(() => import('./GameDetailed'));

interface IProps {
  basicInfos: Entity;
}

interface IFilterFields {
  value: string;
  display: string;
}

interface IFilter {
  teams: IFilterFields[];
  phases: IFilterFields[];
  fields: IFilterFields[];
  timeSlots: IFilterFields[];
  onlyYourGames: boolean;
}

const ScheduleTab: React.FunctionComponent<IProps> = (props) => {
  const router = useRouter();
  const { gameId } = router.query;
  const { basicInfos } = props;

  const [filter, setFilter] = React.useState<IFilter>();

  if (gameId) {
    return <GameDetailed gameId={typeof gameId === 'string' ? gameId : gameId[0]} basicInfos={basicInfos} />;
  }
  return <AllGames setFilter={setFilter} oldFilter={filter} />;
};
export default ScheduleTab;
