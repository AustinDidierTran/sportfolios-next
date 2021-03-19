const About = loadable(() => import('../../../tabs/About'));

import React, { useEffect } from 'react';

import { IgContainer, HeaderHome } from '../../../components/Custom';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';

import loadable from '@loadable/component';

export default function OrganizationAbout(props) {
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer>
        <div>
          <About {...{ basicInfos }} />
        </div>
      </IgContainer>
    </>
  );
}
