import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';
import { useWindowSize } from '../../../public/src/hooks/window';
import { MOBILE_WIDTH } from '../../../public/common/constants';

const ScheduleInteractiveTool = dynamic(() => import('../../../public/src/views/ScheduleInteractiveTool'));
const ScheduleManagerMobile = dynamic(() => import('../../../public/src/views/ScheduleManagerMobile'));

const ScheduleInteractiveToolRoute = () => {
  const { t } = useTranslation();
  const [width] = useWindowSize();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.scheduleInteractiveTool.title')} />
        <meta property="og:description" content={t('metadata.scheduleInteractiveTool.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      {width < MOBILE_WIDTH ? <ScheduleManagerMobile /> : <ScheduleInteractiveTool />}
    </>
  );
};

export default ScheduleInteractiveToolRoute;
