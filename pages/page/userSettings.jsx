import React from 'react';
import UserSettings from '../../public/src/views/UserSettings';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const UserSettingsRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.userSettings.title')} />
        <meta property="og:description" content={t('metadata.userSettings.description')} />
        <meta property="og:image" content="" />
      </Head>
      <UserSettings />
    </>
  );
};

export default UserSettingsRoute;
