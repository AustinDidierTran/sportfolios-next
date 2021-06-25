import React from 'react';

import PendingPlayers from './PendingPlayers';
import Players from './Players';
import Rosters from './Rosters';

interface IProps {
  adminView: boolean;
}

const TabTeamRosters: React.FunctionComponent<IProps> = (props) => {
  const { adminView } = props;

  return (
    <>
      <Rosters adminView={adminView}></Rosters>
      {adminView ? <PendingPlayers /> : null}
      <Players adminView={adminView}></Players>
    </>
  );
};

export default TabTeamRosters;
