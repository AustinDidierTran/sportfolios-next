import React from 'react';
import { LoadingSpinner } from '../../public/src/components/Custom';
import { useApiRoute } from '../../public/src/hooks/queries';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const Checkout = dynamic(() => import('../../public/src/views/Checkout'));

const CheckoutRoute = () => {
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.checkout.title')} />
          <meta property="og:description" content={t('metadata.checkout.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
        </Head>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.checkout.title')} />
        <meta property="og:description" content={t('metadata.checkout.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <Checkout total={response.total} />
    </>
  );
};

export default CheckoutRoute;
