import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const UserSettingsFacebook = dynamic(() => import('../../../public/src/views/UserSettings/AppLinking/Facebook'));

const FacebookLoginRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.userSettings.title')} />
        <meta property="og:description" content={t('metadata.userSettings.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <UserSettingsFacebook />
    </>
  );
};

export default FacebookLoginRoute;
