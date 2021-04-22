import React from 'react';

import { GLOBAL_ENUM } from '../../../../common/enums';
import Error from 'next/error';
import dynamic from 'next/dynamic';

const HeaderOrganization = dynamic(() => import('./HeaderOrganization'));
const HeaderEvent = dynamic(() => import('./HeaderEvent'));

export default function HeaderHome(props) {
  const {
    basicInfos: { type },
  } = props;

  if (type === GLOBAL_ENUM.ORGANIZATION) {
    return <HeaderOrganization {...props} />;
  }
  if (type === GLOBAL_ENUM.EVENT) {
    return <HeaderEvent {...props} />;
  }
  return <Error />;
}
