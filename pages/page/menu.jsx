import React from 'react';
import Menu from '../../public/src/views/Menu';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const MenuRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.menu.title')} />
        <meta property="og:description" content={t('metadata.menu.description')} />
        <meta property="og:image" content="" />
      </Head>
      <Menu />
    </>
  );
};

export default MenuRoute;
