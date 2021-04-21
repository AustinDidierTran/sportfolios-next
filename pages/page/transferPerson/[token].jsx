import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';

const TransferPerson = loadable(() => import('../../../public/src/views/TransferPerson'));

const TransferPersonRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.transferPerson.title')} />
        <meta property="og:description" content={t('metadata.transferPerson.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <TransferPerson />
    </>
  );
};

export default TransferPersonRoute;
