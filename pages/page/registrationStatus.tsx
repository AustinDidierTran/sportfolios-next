import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const RegistrationStatus = dynamic(() => import('../../public/src/views/RegistrationStatus'));

const RegistrationStatusRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.registrationStatus.title')} />
        <meta property="og:description" content={t('metadata.registrationStatus.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <RegistrationStatus />
    </>
  );
};

export default RegistrationStatusRoute;
