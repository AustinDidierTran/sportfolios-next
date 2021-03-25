import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';

export default function OrganizationLeague(props) {
  const { basicInfos } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <IgContainer>
      <div></div>
    </IgContainer>
  );
}
