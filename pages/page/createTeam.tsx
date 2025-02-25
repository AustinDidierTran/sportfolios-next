import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const TeamCreation = dynamic(() => import('../../public/src/views/CreateTeam'));

const CreateTeam: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createTeam.title')} />
        <meta property="og:description" content={t('metadata.createTeam.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <TeamCreation />
    </>
  );
};

export default CreateTeam;
