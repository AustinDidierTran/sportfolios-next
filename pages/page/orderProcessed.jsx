import React from 'react';
import OrderProcessed from '../../public/src/views/OrderProcessed';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const OrderProcessedRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.orderProcessed.title')} />
        <meta property="og:description" content={t('metadata.orderProcessed.description')} />
        <meta property="og:image" content="" />
      </Head>
      <OrderProcessed />
    </>
  );
};

export default OrderProcessedRoute;
