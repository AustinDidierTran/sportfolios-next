import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';

const RosterInvite = loadable(() => import('../../../public/src/views/RosterInvite'));

const RosterInviteRoute = () => {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.inviteRoster.title')} />
        <meta property="og:description" content={t('metadata.inviteRoster.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <RosterInvite token={token} />
    </>
  );
};

export default RosterInviteRoute;
