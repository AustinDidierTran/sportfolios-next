import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ConfirmEmailFailure = dynamic(() => import('../../public/src/views/ConfirmEmail/ConfirmEmailFailure'));

const ConfirmEmailFailureRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmEmailFailure.title')} />
        <meta property="og:description" content={t('metadata.confirmEmailFailure.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ConfirmEmailFailure />
    </>
  );
};

export default ConfirmEmailFailureRoute;
