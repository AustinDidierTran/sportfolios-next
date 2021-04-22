import { useRouter } from 'next/router';
import React from 'react';
import { formatRoute } from '../../public/common/utils/stringFormat';
import api from '../../public/src/actions/api';
import { goTo } from '../../public/src/actions/goTo';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const AddBankAccount = dynamic(() => import('../../public/src/views/AddBankAccount'));

const AddBankAccountRoute = () => {
  const router = useRouter();
  const { entityId, id } = router.query;
  const { t } = useTranslation();

  React.useEffect(() => {
    hasStripeAccount();
  }, [entityId]);

  const hasStripeAccount = async () => {
    if (!entityId) {
      return;
    }
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }));
    if (!hasStripeAccount) {
      goTo(`/${entityId}?tab=settings`);
    }
  };

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.addBankAccount.title')} />
        <meta property="og:description" content={t('metadata.addBankAccount.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <AddBankAccount entityId={entityId} id={id} />
    </>
  );
};
export default AddBankAccountRoute;
