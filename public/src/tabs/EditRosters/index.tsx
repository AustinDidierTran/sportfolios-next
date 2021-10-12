import React from 'react';

import dynamic from 'next/dynamic';

const Rosters = dynamic(() => import('../Rosters'));

interface IProps {
  isAdmin: boolean;
  eventInfo: any;
}

const EditRosters: React.FunctionComponent<IProps> = (props) => {
  const { isAdmin, eventInfo } = props;
  return <Rosters eventInfo={eventInfo} isAdmin={isAdmin} />;
};
export default EditRosters;
