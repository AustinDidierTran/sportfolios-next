import React from 'react';
import ImportMembers from '../../public/src/views/ImportMembers';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ImportMembersRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.importMembers.title')} />
        <meta property="og:description" content={t('metadata.importMembers.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ImportMembers />
    </>
  );
};

export default ImportMembersRoute;
