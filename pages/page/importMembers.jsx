import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ImportMembers = dynamic(() => import('../../public/src/views/ImportMembers'));

const ImportMembersRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.importMembers.title')} />
        <meta property="og:description" content={t('metadata.importMembers.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ImportMembers />
    </>
  );
};

export default ImportMembersRoute;
