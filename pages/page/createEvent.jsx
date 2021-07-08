import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const EventCreation = dynamic(() => import('../../public/src/views/CreateEvent'));

const CreateEvent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createEvent.title')} />
        <meta property="og:description" content={t('metadata.createEvent.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <EventCreation />
    </>
  );
};

export default CreateEvent;
