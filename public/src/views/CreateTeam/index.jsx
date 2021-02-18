import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../common/enums';
import { EntityCreate } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';

export default function CreateTeam() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_team'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.TEAM} />;
}
