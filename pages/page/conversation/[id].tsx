import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../../public/src/components/Custom/LoadingSpinner';

const Convo = dynamic(() => import('../../../public/src/views/Conversation'));

const Conversation: React.FunctionComponent = () => {
  const router = useRouter();
  const { id: convoId } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.conversation.title')} />
        <meta property="og:description" content={t('metadata.conversation.description')} />
      </Head>
      {convoId ? <Convo convoId={convoId as string} /> : <LoadingSpinner />}
    </>
  );
};
export default Conversation;
