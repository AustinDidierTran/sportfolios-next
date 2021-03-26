import React from 'react';

import { GLOBAL_ENUM } from '../../../../common/enums';
import Error from 'next/error';
import loadable from '@loadable/component';

const HeaderOrganization = loadable(() => import('./HeaderOrganization'));
const HeaderEvent = loadable(() => import('./HeaderEvent'));

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
