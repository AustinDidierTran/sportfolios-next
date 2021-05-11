import React, { useEffect } from 'react';

import { AddGaEvent } from '../../components/Custom/Analytics';
import { formatPageTitle } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import Button from '../../components/Custom/Button';
import styles from './LandingPage.module.css';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../actions/goTo';

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
    <div>
      <WhatIsSportfolios />
      <Page4 />
      <Page5 />
      <div className={styles.login}>
        <Button
          onClick={() => {
            AddGaEvent({
              category: 'Landing page',
              action: 'User clicked to be redirected to login',
              label: 'landing_page_login',
            });
            goTo(ROUTES.login);
          }}
        >
          {t('landingPage.presentation.9')}
        </Button>
      </div>
    </div>
  );
}
