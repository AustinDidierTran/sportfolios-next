import React from 'react';
import AdminPanel from '../../public/src/views/AdminPanel';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const AdminPanelRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.adminPanel.title')} />
        <meta property="og:description" content={t('metadata.adminPanel.description')} />
        <meta property="og:image" content="" />
      </Head>
      <AdminPanel />
    </>
  );
};

export default AdminPanelRoute;
