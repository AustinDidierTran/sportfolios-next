import React from 'react';
import RedirectWithToken from '../../public/src/views/RedirectWithToken';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const RedirectRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.redirect.title')} />
        <meta property="og:description" content={t('metadata.redirect.description')} />
        <meta property="og:image" content="" />
      </Head>
      <RedirectWithToken />
    </>
  );
};

export default RedirectRoute;
