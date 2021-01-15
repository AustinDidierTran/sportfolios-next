import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { EntityCreate } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';

export default function CreatePerson() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create_person'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.PERSON} />;
}
