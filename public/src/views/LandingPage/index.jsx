import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import loadable from '@loadable/component';

const Page1 = loadable(() => import('./Page1'));
const Page2 = loadable(() => import('./Page2'));
const Page4 = loadable(() => import('./Page4'));
const Page5 = loadable(() => import('./Page5'));

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
      <Page1 />
      <Page2 />
      <Page4 />
      <Page5 />
    </div>
  );
}
