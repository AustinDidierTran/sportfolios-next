import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const Analytics = dynamic(() => import('../../public/src/views/Analytics'));

const AnalyticsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.analytics.title')} />
        <meta property="og:description" content={t('metadata.analytics.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <Analytics />
    </>
  );
};

export default AnalyticsRoute;
