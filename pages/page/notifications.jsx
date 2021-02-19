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
        <meta property="og:image" content="" />
      </Head>
      <NotificationsMobile />
    </>
  );
};

export default NotificationsRoute;
