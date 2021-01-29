import React from 'react';
import Error from 'next/error';
import { GLOBAL_ENUM } from '../public/common/enums';
import { useApiRoute } from '../public/src/hooks/queries';
import { LoadingSpinner } from '../public/src/components/Custom';
import { useRouter } from 'next/router';
const Event = loadable(() => import('../../public/src/views/Entity/Event'));
const Organization = loadable(() => import('../../public/src/views/Entity/Organization/home.jsx'));
const Person = loadable(() => import('../../public/src/views/Entity/Person'));
const Team = loadable(() => import('../../public/src/views/Entity/Team'));
import { formatRoute } from '../public/common/utils/stringFormat';
import loadable from '@loadable/component';
import { formatRoute } from '../public/common/utils/stringFormat';
const Event = loadable(() => import('../public/src/views/Entity/Event'));
const Organization = loadable(() => import('../public/src/views/Entity/Organization/home.jsx'));
const Person = loadable(() => import('../public/src/views/Entity/Person'));
const Team = loadable(() => import('../public/src/views/Entity/Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function EntityRoute() {
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
