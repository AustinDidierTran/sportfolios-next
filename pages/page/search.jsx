import React from 'react';
import Search from '../../public/src/views/Search';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const SearchRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.search.title')} />
        <meta property="og:description" content={t('metadata.search.description')} />
        <meta property="og:image" content="" />
      </Head>
      <Search />
    </>
  );
};

export default SearchRoute;
