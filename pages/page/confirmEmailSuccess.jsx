import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ConfirmEmailSuccess = dynamic(() => import('../../public/src/views/ConfirmEmail/ConfirmEmailSuccess'));

const ConfirmEmailSuccessRoute = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmailSuccess.title')} />
        <meta property="og:description" content={t('metadata.confirmEmailSuccess.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ConfirmEmailSuccess />
    </>
  );
};

export default ConfirmEmailSuccessRoute;
