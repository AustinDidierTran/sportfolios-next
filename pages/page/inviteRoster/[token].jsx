import React from 'react';
import RosterInvite from '../../../public/src/views/RosterInvite';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const RosterInviteRoute = () => {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.inviteRoster.title')} />
        <meta property="og:description" content={t('metadata.inviteRoster.description')} />
        <meta property="og:image" content="" />
      </Head>
      <RosterInvite token={token} />
    </>
  );
};

export default RosterInviteRoute;
