import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

export default function CreatePerson() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_person'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.PERSON} />;
}
