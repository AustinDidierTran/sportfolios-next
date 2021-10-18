import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Conversation = dynamic(() => import('../../public/src/views/Message'));
//const TeamCreation = dynamic(() => import('../../public/src/views/CreateTeam'));

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.message.title')} />
        <meta property="og:description" content={t('metadata.message.description')} />
      </Head>
      <Conversation />
    </>
  );
};
export default message;
