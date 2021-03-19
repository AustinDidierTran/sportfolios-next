import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';

export default function OrganizationLeague(props) {
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer>
        <div></div>
      </IgContainer>
    </>
  );
}
