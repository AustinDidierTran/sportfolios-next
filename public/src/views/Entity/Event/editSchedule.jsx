const Schedule = loadable(() => import('../../../tabs/EditSchedule'));

import React, { useEffect } from 'react';

import HeaderHome from '../../../components/Custom/HeaderHome';
import IgContainer from '../../../components/Custom/IgContainer';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';

import loadable from '@loadable/component';

export default function EventTeams(props) {
  const { basicInfos, navBar, eventInfo } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} eventInfo={eventInfo} navTabs={navBar} type={GLOBAL_ENUM.EVENT} />
      <IgContainer>
        <div>
          <Schedule {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
