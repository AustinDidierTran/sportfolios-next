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
  const [updated, setUpdated] = useState<boolean>(true);
  const [filter, setFilter] = useState<IOldFilter>();

  const update = () => {
    setUpdated(!updated);
  };

  return (
    <>
      <CreateSchedule update={update} />
      <AllEditGames updated={updated} setFilter={setFilter} oldFilter={filter} />
    </>
  );
};
export default EditScheduleTab;
