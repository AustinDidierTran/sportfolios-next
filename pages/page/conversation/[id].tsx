import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Convo = dynamic(() => import('../../../public/src/views/Conversation'));

const Conversation: React.FunctionComponent = () => {
  const router = useRouter();
  const { id: convoId, recipientId: recipientId } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.conversation.title')} />
        <meta property="og:description" content={t('metadata.conversation.description')} />
      </Head>
      <Convo convoId={convoId as string} recipientId={recipientId as string} />
    </>
  );
};
export default Conversation;
