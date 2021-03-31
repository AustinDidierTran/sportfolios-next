import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import loadable from '@loadable/component';

const Page1 = loadable(() => import('./Page1'));
const Page4 = loadable(() => import('./Page4'));
const Page5 = loadable(() => import('./Page5'));
const LaRuchePage = loadable(() => import('./LaRuchePage'));

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
      <Page1 />
      <Page4 />
      <Page5 />
    </div>
  );
}
