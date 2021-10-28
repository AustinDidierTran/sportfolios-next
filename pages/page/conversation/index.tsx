import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Conversations = dynamic(() => import('../../../public/src/views/Conversations'));

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.messaging.title')} />
        <meta property="og:description" content={t('metadata.messaging.description')} />
      </Head>
      <Conversations />
    </>
  );
};
export default message;
