import React from 'react';
import ConfirmEmailFailure from '../../public/src/views/ConfirmEmail/ConfirmEmailFailure';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ConfirmEmailFailureRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmailFailure.title')} />
        <meta property="og:description" content={t('metadata.confirmEmailFailure.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <ConfirmEmailFailure />
    </>
  );
};

export default ConfirmEmailFailureRoute;
