import React from 'react';

import Login from '../../public/src/views/Login';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const LoginRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.landingPage.title')} />
        <meta property="og:description" content={t('metadata.landingPage.description')} />
        <meta property="og:image" content="" />
      </Head>
      <Login />
    </>
  );
};

export default LoginRoute;
