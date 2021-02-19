import React from 'react';
import { LoadingSpinner } from '../../public/src/components/Custom';
import { useApiRoute } from '../../public/src/hooks/queries';
import Checkout from '../../public/src/views/Checkout';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CheckoutRoute = () => {
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.checkout.title')} />
        <meta property="og:description" content={t('metadata.checkout.description')} />
        <meta property="og:image" content="" />
      </Head>
      <Checkout total={response.total} />
    </>
  );
};

export default CheckoutRoute;
