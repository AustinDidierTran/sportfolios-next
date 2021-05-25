import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import styles from './LandingPage.module.css';
import LoginBar from './LoginBar';
import SportfoliosPresentation from './SportfoliosPresentation';
import Modules from './Modules';
import ValueProposition from './ValueProposition';
import Pricing from './Pricing';
import Team from './Team';

const Page5 = dynamic(() => import('./Page5'));

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
    <div className={styles.container}>
      <LoginBar />
      <SportfoliosPresentation />
      <Modules />
      <ValueProposition />
      <Pricing />
      {/* TODO: Add team */}
      <Team />
      {/* <Page4 /> */}
      <Page5 />
    </div>
  );
}
