import React from 'react';
import ShopDetails from '../../../../public/src/views/ShopDetails';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ShopDetailsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.shopDetails.title')} />
        <meta property="og:description" content={t('metadata.shopDetails.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ShopDetails />
    </>
  );
};

export default ShopDetailsRoute;
