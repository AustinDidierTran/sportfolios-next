import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AllEditGames = dynamic(() => import('./AllEditGames'));
const CreateSchedule = dynamic(() => import('./CreateSchedule'));

interface IOldFilter {
  onlyYourGames: boolean;
  teams: IFilterFields[];
  phases: IFilterFields[];
  fields: IFilterFields[];
  timeSlots: IFilterFields[];
}

interface IFilterFields {
  value: string;
  display: string;
}

const EditScheduleTab: React.FunctionComponent = () => {
  const [filter, setFilter] = useState<IOldFilter>();

  return (
    <>
      <CreateSchedule />
      <AllEditGames setFilter={setFilter} oldFilter={filter} />
    </>
  );
};
export default EditScheduleTab;
