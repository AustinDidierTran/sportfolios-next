import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';
import LoadingSpinner from '../../../public/src/components/Custom/LoadingSpinner';

const ValidationAccount = dynamic(() => import('../../../public/src/views/ValidationAccount'));

const ValidationAccountRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { email: emailProps } = router.query;
  const { t } = useTranslation();
  const email = useMemo<string>(() => {
    if (Array.isArray(emailProps)) {
      return emailProps[0];
    }
    return emailProps;
  }, [emailProps]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.validationAccount.title')} />
        <meta property="og:description" content={t('metadata.validationAccount.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      {email ? <ValidationAccount email={email} /> : <LoadingSpinner />}
    </>
  );
};
export default ValidationAccountRoute;
