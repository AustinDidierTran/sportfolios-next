import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const PrivacyPolicy = dynamic(() => import('../../public/src/views/PrivacyPolicy'));

const PrivacyRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.privacy.title')} />
        <meta property="og:description" content={t('metadata.privacy.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <PrivacyPolicy />
    </>
  );
};

export default PrivacyRoute;
