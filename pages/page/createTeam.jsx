import React from 'react';
import TeamCreation from '../../public/src/views/CreateTeam';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CreateTeam = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createTeam.title')} />
        <meta property="og:description" content={t('metadata.createTeam.description')} />
        <meta property="og:image" content="" />
      </Head>
      <TeamCreation />
    </>
  );
};

export default CreateTeam;
