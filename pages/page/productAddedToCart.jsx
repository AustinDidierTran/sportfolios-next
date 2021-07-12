import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ProductAddedToCart = dynamic(() => import('../../public/src/views/ProductAddedToCart'));

const ProductAddedToCartRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.productAddedToCartRoute.title')} />
        <meta property="og:description" content={t('metadata.productAddedToCartRoute.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ProductAddedToCart />
    </>
  );
};

export default ProductAddedToCartRoute;
