import * as React from 'react';

import { Teams } from './AdminEntities/teams';
import { Events } from './AdminEntities/events';
import { People } from './AdminEntities/people';
import { Organizations } from './AdminEntities/organizations';
import Organization from '../Entity/Organization';

const AdminEntitiesView: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Teams />
      <Events />
      <People />
      <Organizations />
    </React.Fragment>
  );
};

export default AdminEntitiesView;
