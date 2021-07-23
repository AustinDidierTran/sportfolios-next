import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ForgotPassword = dynamic(() => import('../../public/src/views/ForgotPassword'));

const ForgotPasswordRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.forgotPassword.title')} />
        <meta property="og:description" content={t('metadata.forgotPassword.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordRoute;
