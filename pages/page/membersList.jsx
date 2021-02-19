import React from 'react';
import MembersList from '../../public/src/views/MembersList';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const MembersListRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.membersList.title')} />
        <meta property="og:description" content={t('metadata.membersList.description')} />
        <meta property="og:image" content="" />
      </Head>
      <MembersList />
    </>
  );
};

export default MembersListRoute;
