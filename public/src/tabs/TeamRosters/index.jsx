import React from 'react';

import Players from './Players';
import Rosters from './Rosters';

export default function TabTeamRosters(props) {
  const { adminView } = props;

  return (
    <>
      <Rosters></Rosters>
      <Players adminView={adminView}></Players>
    </>
  );
}
