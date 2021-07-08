import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const ConfirmationEmailSent = dynamic(() => import('../../../public/src/views/ConfirmationEmailSent'));

const ConfirmationEmailSentRoute = () => {
  const router = useRouter();
  const { email } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmationEmailSent.title')} />
        <meta property="og:description" content={t('metadata.confirmationEmailSent.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <ConfirmationEmailSent email={email} />
    </>
  );
};

export default ConfirmationEmailSentRoute;
