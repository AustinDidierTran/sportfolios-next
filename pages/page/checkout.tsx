import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM, REQUEST_STATUS_ENUM } from '../../public/common/enums';
import api from '../../public/src/actions/api';

const Checkout = dynamic(() => import('../../public/src/views/Checkout'));

const CheckoutRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async () => {
    setIsLoading(true);
    const { status, data } = await api('/api/shop/cartTotal', { method: 'GET' });
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setTotal(data.total);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.checkout.title')} />
        <meta property="og:description" content={t('metadata.checkout.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      {isLoading ? <LoadingSpinner /> : <Checkout total={total} />}
    </>
  );
};

export default CheckoutRoute;
