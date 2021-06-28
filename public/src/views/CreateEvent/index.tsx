import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { formatPageTitle } from '../../utils/stringFormats';

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

const CreateEvent: React.FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_event'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.EVENT} />;
};
export default CreateEvent;
