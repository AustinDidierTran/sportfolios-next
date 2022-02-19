import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const SignupFacebook = dynamic(() => import('../../../public/src/views/v2/Authentication/Facebook/signup'));

const SignupFacebookRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.signup.title')} />
        <meta property="og:description" content={t('metadata.signup.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <SignupFacebook />
    </>
  );
};

export default SignupFacebookRoute;
