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
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <MembersList />
    </>
  );
};

export default MembersListRoute;
