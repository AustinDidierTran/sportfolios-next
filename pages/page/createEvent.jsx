import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const EventCreation = dynamic(() => import('../../public/src/views/CreateEvent'));

const CreateEvent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createEvent.title')} />
        <meta property="og:description" content={t('metadata.createEvent.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <EventCreation />
    </>
  );
};

export default CreateEvent;
