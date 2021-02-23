import React from 'react';
import Sales from '../../../public/src/views/Sales';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const SalesRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.sales.title')} />
        <meta property="og:description" content={t('metadata.sales.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <Sales />
    </>
  );
};

export default SalesRoute;
