import React, { useContext } from 'react';

import BottomPageLogo from '../../../components/Custom/BottomPageLogo';
import General from './General';
import Admin from './Admin';
import Registration from './Registration';
import { useAdmin, useEditor } from '../../../hooks/roles';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Store } from '../../../Store';
import { Entity } from '../../../../../typescript/types';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

interface IProps {
  basicInfos: Entity;
  role: ENTITIES_ROLE_ENUM;
}

const AllEventSettings: React.FunctionComponent<IProps> = (props) => {
  const { basicInfos, role } = props;
  const {
    state: { id },
  } = useContext(Store);

  const isAdmin = useAdmin(role);

  const isEditor = useEditor(role);

  if (!isEditor) {
    goTo(ROUTES.entity, { id });
  }

  return (
    <div>
      <General basicInfos={basicInfos} role={role} />
      <Registration />
      {isAdmin && <Admin role={role} basicInfos={basicInfos} />}
      <BottomPageLogo />
    </div>
  );
};
export default AllEventSettings;
