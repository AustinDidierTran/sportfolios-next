import React from 'react';
import LandingPage from '../../public/src/views/LandingPage';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const LandingPageRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.landingPage.title')} />
        <meta property="og:description" content={t('metadata.landingPage.description')} />
        <meta property="og:image" content="" />
      </Head>
      <LandingPage />
    </>
  );
};

export default LandingPageRoute;
