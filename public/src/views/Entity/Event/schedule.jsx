const Schedule = loadable(() => import('../../../tabs/Schedule'));

import React, { useEffect } from 'react';

import { IgContainer, HeaderHome } from '../../../components/Custom';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';

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
          <Schedule {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
