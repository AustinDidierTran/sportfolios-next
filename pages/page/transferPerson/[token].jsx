import React from 'react';
import TransferPerson from '../../../public/src/views/TransferPerson';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const TransferPersonRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.transferPerson.title')} />
        <meta property="og:description" content={t('metadata.transferPerson.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <TransferPerson />
    </>
  );
};

export default TransferPersonRoute;
