import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { EntityCreate } from '../../components/Custom';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';

export default function CreateEvent() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create_event'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.EVENT} />;
}
