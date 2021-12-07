import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

const NewMessage = dynamic(() => import('../../public/src/views/newMessage'));

const newMessage: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { recipientId } = router.query;
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.newMessage.title')} />
        <meta property="og:description" content={t('metadata.newMessage.description')} />
      </Head>
      <NewMessage recipientId={recipientId as string} />
    </>
  );
};
export default newMessage;
