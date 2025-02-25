import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IMAGE_ENUM } from '../../../public/common/enums';

const TransferPerson = dynamic(() => import('../../../public/src/views/TransferPerson'));

const TransferPersonRoute: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.transferPerson.title')} />
        <meta property="og:description" content={t('metadata.transferPerson.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <TransferPerson />
    </>
  );
};

export default TransferPersonRoute;
