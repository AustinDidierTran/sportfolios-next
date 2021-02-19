import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ROUTES } from '../../public/src/actions/goTo';
import AddPaymentMethod from '../../public/src/views/AddPaymentMethod';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const AddPaymentMethodRoute = () => {
  const router = useRouter();
  const { redirect: redirectProps } = router.query;
  const { t } = useTranslation();

  const redirect = useMemo(() => {
    if (redirectProps) {
      return redirectProps;
    }
    return ROUTES.userSettings;
  });

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.addPaymentMethod.title')} />
        <meta property="og:description" content={t('metadata.addPaymentMethod.description')} />
        <meta property="og:image" content="" />
      </Head>
      <AddPaymentMethod redirect={redirect} />
    </>
  );
};

export default AddPaymentMethodRoute;
