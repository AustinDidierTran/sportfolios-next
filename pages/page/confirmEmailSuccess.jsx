import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const ConfirmEmailSuccess = dynamic(() => import('../../public/src/views/ConfirmEmail/ConfirmEmailSuccess'));

const ConfirmEmailSuccessRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmailSuccess.title')} />
        <meta property="og:description" content={t('metadata.confirmEmailSuccess.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <ConfirmEmailSuccess />
    </>
  );
};

export default ConfirmEmailSuccessRoute;
