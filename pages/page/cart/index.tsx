import React from 'react';
import { IMAGE_ENUM } from '../../../public/common/enums';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('../../../public/src/views/v2/Cart'));

const CartRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.cart.title')} />
        <meta property="og:description" content={t('metadata.cart.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <Cart />
    </>
  );
};

export default CartRoute;
