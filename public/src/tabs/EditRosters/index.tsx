import React from 'react';

import dynamic from 'next/dynamic';

const Rosters = dynamic(() => import('../Rosters'));

const EditRosters: React.FunctionComponent = () => {
  return <Rosters isEventAdmin />;
}
export default EditRosters;