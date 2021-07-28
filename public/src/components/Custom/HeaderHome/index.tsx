import React from 'react';

import { GLOBAL_ENUM } from '../../../../common/enums';
import Error from 'next/error';
import dynamic from 'next/dynamic';
import { Entity, NavTabs } from '../../../../../typescript/types';

const HeaderOrganization = dynamic(() => import('./HeaderOrganization'));
const HeaderEvent = dynamic(() => import('./HeaderEvent'));
const HeaderTeam = dynamic(() => import('./HeaderTeam'));

interface IProps {
  basicInfos: Entity;
  eventInfo?: any;
  type: GLOBAL_ENUM;
  navTabs: NavTabs[];
  index: number;
  isAdmin: boolean;
  onSwitch: () => void;
  adminView: boolean;
}

const HeaderHome: React.FunctionComponent<IProps> = (props) => {
  const {
    basicInfos: { type },
  } = props;

  if (type === GLOBAL_ENUM.ORGANIZATION) {
    return <HeaderOrganization {...props} />;
  }
  if (type === GLOBAL_ENUM.EVENT) {
    return <HeaderEvent {...props} />;
  }
  if (type === GLOBAL_ENUM.TEAM) {
    return <HeaderTeam {...props} />;
  }
  return <Error statusCode={404} />;
};
export default HeaderHome;
