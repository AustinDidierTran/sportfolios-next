import React from 'react';
import TransferPersonExpired from '../../public/src/views/TransferPerson/TransferPersonExpired';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const TransferPersonExpiredRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.transferPersonExpired.title')} />
        <meta property="og:description" content={t('metadata.transferPersonExpired.description')} />
        <meta property="og:image" content="" />
      </Head>
      <TransferPersonExpired />
    </>
  );
};

export default TransferPersonExpiredRoute;
