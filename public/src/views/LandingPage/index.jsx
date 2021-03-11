import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import Page1 from './Page1';
import Page2 from './Page2';
import Page4 from './Page4';
import Page5 from './Page5';

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
    <>
      <Page1 />
      <Page2 />
      <Page4 />
      <Page5 />
    </>
  );
}
