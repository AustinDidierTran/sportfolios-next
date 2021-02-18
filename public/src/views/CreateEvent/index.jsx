import React from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { EntityCreate } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function CreateEvent() {
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
}
