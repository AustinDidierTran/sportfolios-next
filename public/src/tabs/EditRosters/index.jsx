import React from 'react';

import dynamic from 'next/dynamic';

const Rosters = dynamic(() => import('../Rosters'));

export default function EditRosters() {
  return <Rosters isEventAdmin />;
}
