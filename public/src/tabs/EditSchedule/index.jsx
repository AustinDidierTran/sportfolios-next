import React, { useState } from 'react';
import loadable from '@loadable/component';

const AllEditGames = loadable(() => import('./AllEditGames'));
const CreateSchedule = loadable(() => import('./CreateSchedule'));

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
