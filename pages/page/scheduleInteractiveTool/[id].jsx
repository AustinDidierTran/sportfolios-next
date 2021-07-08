import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ScheduleInteractiveTool = dynamic(() => import('../../../public/src/views/ScheduleInteractiveTool'));

const ScheduleInteractiveToolRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.scheduleInteractiveTool.title')} />
        <meta property="og:description" content={t('metadata.scheduleInteractiveTool.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ScheduleInteractiveTool />
    </>
  );
};

export default ScheduleInteractiveToolRoute;
