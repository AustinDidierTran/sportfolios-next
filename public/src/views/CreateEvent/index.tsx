import React from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import dynamic from 'next/dynamic';

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

const CreateEvent: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <meta property="og:title" content={formatPageTitle(t('create.create_event'))} />
        <meta property="og:description" content={t('create.create_your_event')} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CA" />
        <title>{formatPageTitle(t('create.create_event'))}</title>
      </Helmet>
      <EntityCreate type={GLOBAL_ENUM.EVENT} />
    </>
  );
};
export default CreateEvent;
