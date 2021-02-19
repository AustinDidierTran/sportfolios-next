import React from 'react';
import RegistrationStatus from '../../public/src/views/RegistrationStatus';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const RegistrationStatusRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.registrationStatus.title')} />
        <meta property="og:description" content={t('metadata.registrationStatus.description')} />
        <meta property="og:image" content="" />
      </Head>
      <RegistrationStatus />
    </>
  );
};

export default RegistrationStatusRoute;
