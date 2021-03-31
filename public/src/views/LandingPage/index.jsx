import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import loadable from '@loadable/component';

const Page4 = loadable(() => import('./Page4'));
const Page5 = loadable(() => import('./Page5'));
const LaRuchePage = loadable(() => import('./LaRuchePage'));
const WhatisSportfolios = loadable(() => import('./WhatisSportfolios'));

export default function LandingPage() {
  useEffect(() => {
    document.title = formatPageTitle('Sportfolios');
    AddGaEvent({
      category: 'Landing page',
      action: 'User visited landing page',
      label: 'landing_page_visit',
    });
  }, []);

  return (
    <div>
      <LaRuchePage />
      <WhatisSportfolios />
      <Page4 />
      <Page5 />
    </div>
  );
}
