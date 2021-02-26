import React from 'react';
import NotificationsMobile from '../../public/src/views/Notifications';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const NotificationsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.notifications.title')} />
        <meta property="og:description" content={t('metadata.notifications.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <NotificationsMobile />
    </>
  );
};

export default NotificationsRoute;
