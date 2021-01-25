import React from 'react';
import loadable from '@loadable/component';

import { GLOBAL_ENUM } from '../../../../common/enums';
import { useApiRoute } from '../../hooks/queries';
import { LoadingSpinner } from '../../components/Custom';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { formatRoute } from '../../../common/utils/stringFormat';

const Event = loadable(() => import('./Event'));
const Organization = loadable(() => import('./Organization'));
const Person = loadable(() => import('./Person'));
const Team = loadable(() => import('./Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function Entity() {
  const router = useRouter();
  const { id } = router.query;

  const { response, isLoading } = useApiRoute(formatRoute('/api/entity', null, { id }), {
    defaultValue: {},
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!response) {
    return <Error />;
  }

  const EntityObject = EntityMap[response.basicInfos.type];

  if (!EntityObject) {
    return <Error />;
  }
  return <EntityObject {...response} />;
}
