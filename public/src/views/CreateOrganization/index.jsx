import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';

const EntityCreate = loadable(() => import('../../components/Custom/EntityCreate'));

export default function CreateOrganization() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_organization'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.ORGANIZATION} />;
}
