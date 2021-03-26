import React from 'react';

import loadable from '@loadable/component';

const Rosters = loadable(() => import('../Rosters'));

export default function EditRosters() {
  return <Rosters isEventAdmin />;
}
