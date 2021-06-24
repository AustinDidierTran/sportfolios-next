import React, { useEffect } from 'react';
import { GLOBAL_ENUM } from '../../../common/enums';
import { formatPageTitle } from '../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const EntityCreate = dynamic(() => import('../../components/Custom/EntityCreate'));

const CreateOrganization: React.FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = formatPageTitle(t('create.create_organization'));
  }, []);

  return <EntityCreate type={GLOBAL_ENUM.ORGANIZATION} />;
};
export default CreateOrganization;
