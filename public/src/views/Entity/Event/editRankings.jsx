const Rankings = loadable(() => import('../../../tabs/EditRankings'));

import React, { useEffect } from 'react';

import HeaderHome from '../../../components/Custom/HeaderHome';
import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';
import { GLOBAL_ENUM } from '../../../../common/enums';

import loadable from '@loadable/component';

export default function EventTeams(props) {
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.EVENT} />
      <IgContainer>
        <div>
          <Rankings {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
