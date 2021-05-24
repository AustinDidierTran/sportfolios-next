import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import Button from '../../components/Custom/Button';
import styles from './LandingPage.module.css';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';
import LoginBar from './LoginBar';
import SportfoliosPresentation from './SportfoliosPresentation';
import Modules from './Modules';
import ValueProposition from './ValueProposition';
import Pricing from './Pricing';

const Page4 = dynamic(() => import('./Page4'));
const Page5 = dynamic(() => import('./Page5'));
const WhatIsSportfolios = dynamic(() => import('./WhatIsSportfolios'));

export default function LandingPage() {
  const { t } = useTranslation();

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
      {/* <Page4 /> */}
      <Page5 />
    </div>
  );
}
