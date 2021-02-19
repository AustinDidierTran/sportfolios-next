import React from 'react';
import EventRegistration from '../../../public/src/views/EventRegistration';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const EventRegistrationRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.eventRegistration.title')} />
        <meta property="og:description" content={t('metadata.eventRegistration.description')} />
        <meta property="og:image" content="" />
      </Head>
      <EventRegistration />
    </>
  );
};

export default EventRegistrationRoute;
