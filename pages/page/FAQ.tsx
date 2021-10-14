import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Question = dynamic(() => import('../../public/src/views/FAQ'));
//const TeamCreation = dynamic(() => import('../../public/src/views/CreateTeam'));

const FAQ: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.FAQ.title')} />
        <meta property="og:description" content={t('metadata.FAQ.description')} />
      </Head>
      <Question />
    </>
  );
};
export default FAQ;
