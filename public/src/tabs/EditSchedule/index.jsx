import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const AllEditGames = dynamic(() => import('./AllEditGames'));
const CreateSchedule = dynamic(() => import('./CreateSchedule'));

export default function EditScheduleTab() {
  const [updated, setUpdated] = useState(true);
  const [filter, setFilter] = useState();

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
