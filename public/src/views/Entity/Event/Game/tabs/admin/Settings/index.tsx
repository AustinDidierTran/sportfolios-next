import React from 'react';

import dynamic from 'next/dynamic';

const General = dynamic(() => import('./sections/General'));
const Tickets = dynamic(() => import('./sections/Tickets'));

const AdminGameSettings: React.FunctionComponent<any> = (props) => {
  return (
    <>
      <General {...props} />
      <Tickets {...props} />
    </>
  );
};

export default AdminGameSettings;
