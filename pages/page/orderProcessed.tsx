import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const OrderProcessed = dynamic(() => import('../../public/src/views/OrderProcessed'));

const OrderProcessedRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.orderProcessed.title')} />
        <meta property="og:description" content={t('metadata.orderProcessed.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <OrderProcessed />
    </>
  );
};

export default OrderProcessedRoute;
