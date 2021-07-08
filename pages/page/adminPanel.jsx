import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const AdminPanel = dynamic(() => import('../../public/src/views/AdminPanel'));

const AdminPanelRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.adminPanel.title')} />
        <meta property="og:description" content={t('metadata.adminPanel.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <AdminPanel />
    </>
  );
};

export default AdminPanelRoute;
