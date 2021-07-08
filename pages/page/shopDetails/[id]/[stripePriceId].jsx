import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ShopDetails = dynamic(() => import('../../../../public/src/views/ShopDetails'));

const ShopDetailsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.shopDetails.title')} />
        <meta property="og:description" content={t('metadata.shopDetails.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ShopDetails />
    </>
  );
};

export default ShopDetailsRoute;
