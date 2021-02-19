import React from 'react';
import ProductAddedToCart from '../../public/src/views/ProductAddedToCart';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ProductAddedToCartRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.productAddedToCartRoute.title')} />
        <meta property="og:description" content={t('metadata.productAddedToCartRoute.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ProductAddedToCart />
    </>
  );
};

export default ProductAddedToCartRoute;
