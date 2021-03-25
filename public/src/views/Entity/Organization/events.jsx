import React, { useEffect } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';
import loadable from '@loadable/component';

const Events = loadable(() => import('../../../tabs/Events'));

export default function OrganizationEvents(props) {
  const { basicInfos } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  return (
    <IgContainer>
      <div>
        <Events {...{ basicInfos }} />
      </div>
    </IgContainer>
  );
}
