import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AllEditGames = dynamic(() => import('./AllEditGames'));
const CreateSchedule = dynamic(() => import('./CreateSchedule'));

interface IOldFilter {
  onlyYourGames: boolean;
  teamId: string;
  teamName: string;
  phaseId: string;
  phaseName: string;
  fieldId: string;
  fieldName: string;
  timeSlot: string;
}


export default function EditScheduleTab() {
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
}
