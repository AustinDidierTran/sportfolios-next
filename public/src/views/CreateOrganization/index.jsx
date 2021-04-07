import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import EntityCreate from '../../components/Custom/EntityCreate';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';

export default function CreateOrganization() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_organization'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.ORGANIZATION} />;
}
