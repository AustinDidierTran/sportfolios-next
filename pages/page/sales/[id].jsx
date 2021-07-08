import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const Sales = dynamic(() => import('../../../public/src/views/Sales'));

const SalesRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.sales.title')} />
        <meta property="og:description" content={t('metadata.sales.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <Sales />
    </>
  );
};

export default SalesRoute;
