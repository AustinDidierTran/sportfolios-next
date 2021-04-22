import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';

const Page4 = dynamic(() => import('./Page4'));
const Page5 = dynamic(() => import('./Page5'));
const LaRuchePage = dynamic(() => import('./LaRuchePage'));
const WhatIsSportfolios = dynamic(() => import('./WhatIsSportfolios'));

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
      <WhatIsSportfolios />
      <Page4 />
      <Page5 />
    </div>
  );
}
