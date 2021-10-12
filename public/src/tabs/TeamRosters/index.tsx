import React from 'react';
import { Entity } from '../../../../typescript/types';

import PendingPlayers from './PendingPlayers';
import Players from './Players';

interface IProps {
  adminView: boolean;
  basicInfos: Entity;
}

const TabTeamRosters: React.FunctionComponent<IProps> = (props) => {
  const { adminView, basicInfos } = props;

  return (
    <>
      <PendingPlayers role={basicInfos.role} />

      <Players adminView={adminView} />
    </>
  );
};

export default TabTeamRosters;
