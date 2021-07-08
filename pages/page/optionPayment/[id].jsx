import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const OptionPayment = dynamic(() => import('../../../public/src/views/OptionPayment'));

const OptionPaymentRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.optionPayment.title')} />
        <meta property="og:description" content={t('metadata.optionPayment.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <OptionPayment />
    </>
  );
};

export default OptionPaymentRoute;
