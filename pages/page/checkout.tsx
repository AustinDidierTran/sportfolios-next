import React from 'react';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import { useApiRoute } from '../../public/src/hooks/queries';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const Checkout = dynamic(() => import('../../public/src/views/Checkout'));

const CheckoutRoute: React.FunctionComponent = () => {
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.checkout.title')} />
        <meta property="og:description" content={t('metadata.checkout.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      {isLoading ? <LoadingSpinner /> : <Checkout total={response.total} />}
    </>
  );
};

export default CheckoutRoute;
