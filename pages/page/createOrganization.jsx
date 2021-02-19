import React from 'react';
import OrganizationCreation from '../../public/src/views/CreateOrganization';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CreateOrganization = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createOrganization.title')} />
        <meta property="og:description" content={t('metadata.createOrganization.description')} />
        <meta property="og:image" content="" />
      </Head>
      <OrganizationCreation />
    </>
  );
};

export default CreateOrganization;
