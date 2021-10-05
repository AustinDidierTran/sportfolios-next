import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../public/common/enums';

const ResentValidationCode = dynamic(() => import('../../public/src/views/ResentValidationCode'));

const ResentValidationCodeRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.resentValidationCode.title')} />
        <meta property="og:description" content={t('metadata.resentValidationCode.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ResentValidationCode />
    </>
  );
};

export default ResentValidationCodeRoute;
