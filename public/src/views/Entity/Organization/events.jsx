import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import loadable from '@loadable/component';

const Events = loadable(() => import('../../../tabs/Events'));

export default function OrganizationEvents(props) {
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer>
        <div>
          <Events {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
