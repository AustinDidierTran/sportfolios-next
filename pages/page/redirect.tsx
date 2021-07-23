import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const RedirectWithToken = dynamic(() => import('../../public/src/views/RedirectWithToken'));

const RedirectRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.redirect.title')} />
        <meta property="og:description" content={t('metadata.redirect.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <RedirectWithToken />
    </>
  );
};

export default RedirectRoute;
