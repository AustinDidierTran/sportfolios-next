import React from 'react';
import CreateReport from '../../public/src/views/CreateReport';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const CreateReportRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.createReport.title')} />
        <meta property="og:description" content={t('metadata.createReport.description')} />
        <meta property="og:image" content="" />
      </Head>
      <CreateReport />
    </>
  );
};

export default CreateReportRoute;
