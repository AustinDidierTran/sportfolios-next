const About = loadable(() => import('../../../tabs/About'));

import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';

import loadable from '@loadable/component';

export default function OrganizationAbout(props) {
  const { basicInfos } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <IgContainer>
      <div>
        <About {...{ basicInfos }} />
      </div>
    </IgContainer>
  );
}
