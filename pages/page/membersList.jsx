import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const MembersList = dynamic(() => import('../../public/src/views/MembersList'));

const MembersListRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.membersList.title')} />
        <meta property="og:description" content={t('metadata.membersList.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <MembersList />
    </>
  );
};

export default MembersListRoute;
