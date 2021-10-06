import React from 'react';
import { Entity } from '../../../../typescript/types';

import PendingPlayers from './PendingPlayers';
import Players from './Players';
import Rosters from './Rosters';

interface IProps {
  adminView: boolean;
  basicInfos: Entity;
}

const TabTeamRosters: React.FunctionComponent<IProps> = (props) => {
  const { adminView, basicInfos } = props;

  return (
    <>
      <PendingPlayers role={basicInfos.role} />
      {adminView ? <Rosters adminView={adminView} /> : <></>}
      <Players adminView={adminView} />
    </>
  );
};

export default TabTeamRosters;
