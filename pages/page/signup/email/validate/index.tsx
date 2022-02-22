import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../../../public/common/enums';

const ValidationAccount = dynamic(() => import('../../../../../public/src/views/v2/Authentication/Validate'));

const ValidationAccountRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.validationAccount.title')} />
        <meta property="og:description" content={t('metadata.validationAccount.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ValidationAccount />
    </>
  );
};
export default ValidationAccountRoute;
