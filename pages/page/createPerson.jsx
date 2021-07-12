import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const PersonCreation = dynamic(() => import('../../public/src/views/CreatePerson'));

const CreatePerson = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createPerson.title')} />
        <meta property="og:description" content={t('metadata.createPerson.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <PersonCreation />
    </>
  );
};

export default CreatePerson;
