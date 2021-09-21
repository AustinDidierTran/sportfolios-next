import * as React from 'react';

import { Teams } from './AdminEntities/teams';
import { Events } from './AdminEntities/events';

const AdminEntitiesView: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Teams />
      <Events />
    </React.Fragment>
  );
};

export default AdminEntitiesView;
