import React from 'react';
import ScheduleManager from '../../public/src/views/ScheduleManager';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ScheduleManagerRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.scheduleManager.title')} />
        <meta property="og:description" content={t('metadata.scheduleManager.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ScheduleManager />
    </>
  );
};

export default ScheduleManagerRoute;
