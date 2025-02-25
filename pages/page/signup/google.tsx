import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const SignupGoogle = dynamic(() => import('../../../public/src/views/v2/Authentication/Google/signup'));

const SignupGoogleRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.signup.title')} />
        <meta property="og:description" content={t('metadata.signup.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <SignupGoogle />
    </>
  );
};

export default SignupGoogleRoute;
