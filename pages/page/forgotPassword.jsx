import React from 'react';

import ForgotPassword from '../../public/src/views/ForgotPassword';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ForgotPasswordRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.forgotPassword.title')} />
        <meta property="og:description" content={t('metadata.forgotPassword.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordRoute;
