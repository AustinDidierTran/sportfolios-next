import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const PaymentOptionStats = dynamic(() => import('../../../public/src/views/PaymentOptionStats'));

const PaymentOptionStatsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.paymentOptionStats.title')} />
        <meta property="og:description" content={t('metadata.paymentOptionStats.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <PaymentOptionStats />
    </>
  );
};

export default PaymentOptionStatsRoute;
