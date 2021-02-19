import React from 'react';

import ConfirmEmailSuccess from '../../public/src/views/ConfirmEmail/ConfirmEmailSuccess';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ConfirmEmailSuccessRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmailSuccess.title')} />
        <meta property="og:description" content={t('metadata.confirmEmailSuccess.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ConfirmEmailSuccess />
    </>
  );
};

export default ConfirmEmailSuccessRoute;
