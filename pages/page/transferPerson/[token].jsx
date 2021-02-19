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
        <meta property="og:image" content="" />
      </Head>
      <TransferPerson />
    </>
  );
};

export default TransferPersonRoute;
