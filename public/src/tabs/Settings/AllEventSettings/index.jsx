import React from 'react';

import loadable from '@loadable/component';
import BottomPageLogo from '../../../components/Custom/BottomPageLogo';
import General from './General';
import Registration from './Registration';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import Card from '../../../components/Custom/Card';
import { useRouter } from 'next/router';
import { useAdmin, useEditor } from '../../../hooks/roles';
import { goTo, ROUTES } from '../../../actions/goTo';

const ManageRoles = loadable(() => import('../ManageRoles'));

export default function AllEventSettings(props) {
  const { basicInfos, role } = props;

  const router = useRouter();
  const { id } = router.query;

  const isAdmin = useAdmin(role);

  const isEditor = useEditor(role);

  if (!isEditor) {
    goTo(ROUTES.entity, { id });
  }

  return (
    <div>
      <General basicInfos={basicInfos} role={role} />
      <Registration />
      {isAdmin && (
        <>
          <ManageRoles role={role} />
          <Card items={{ id, name: basicInfos.name }} type={CARD_TYPE_ENUM.DELETE_ENTITY} />
          <BottomPageLogo />
        </>
      )}
    </div>
  );
}
