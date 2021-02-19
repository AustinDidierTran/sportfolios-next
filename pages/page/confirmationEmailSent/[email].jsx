import React from 'react';
import { useRouter } from 'next/router';
import ConfirmationEmailSent from '../../../public/src/views/ConfirmationEmailSent';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const ConfirmationEmailSentRoute = () => {
  const router = useRouter();
  const { email } = router.query;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.confirmationEmailSent.title')} />
        <meta property="og:description" content={t('metadata.confirmationEmailSent.description')} />
        <meta property="og:image" content="" />
      </Head>
      <ConfirmationEmailSent email={email} />
    </>
  );
};

export default ConfirmationEmailSentRoute;
