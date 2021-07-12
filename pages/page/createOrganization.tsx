import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const OrganizationCreation = dynamic(() => import('../../public/src/views/CreateOrganization'));

const CreateOrganization: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createOrganization.title')} />
        <meta property="og:description" content={t('metadata.createOrganization.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <OrganizationCreation />
    </>
  );
};

export default CreateOrganization;
