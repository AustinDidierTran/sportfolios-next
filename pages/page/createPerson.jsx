import React from 'react';
import PersonCreation from '../../public/src/views/CreatePerson';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CreatePerson = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createPerson.title')} />
        <meta property="og:description" content={t('metadata.createPerson.description')} />
        <meta property="og:image" content="" />
      </Head>
      <PersonCreation />
    </>
  );
};

export default CreatePerson;
