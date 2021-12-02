import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Conversations = dynamic(() => import('../../../public/src/views/Conversations'));

const message: React.FunctionComponent = () => {
  const router = useRouter();
  const { recipientId: recipientId } = router.query;
  console.log('recipientId : ', recipientId);
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.messaging.title')} />
        <meta property="og:description" content={t('metadata.messaging.description')} />
      </Head>
      <Conversations recipientId={recipientId as string} />
    </>
  );
};
export default message;
