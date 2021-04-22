import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../common/enums';
import { formatPageTitle } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

export default function CreateTeam() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_team'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.TEAM} />;
}
