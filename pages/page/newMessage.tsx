import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const NewMessage = dynamic(() => import('../../public/src/views/newMessage'));

const newMessage: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.newMessage.title')} />
        <meta property="og:description" content={t('metadata.newMessage.description')} />
      </Head>
      <NewMessage />
    </>
  );
};
export default newMessage;
