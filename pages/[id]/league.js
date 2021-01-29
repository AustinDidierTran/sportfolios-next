import React from 'react';
import Error from 'next/error';
import { GLOBAL_ENUM } from '../../public/common/enums';
import { useApiRoute } from '../../public/src/hooks/queries';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import { useRouter } from 'next/router';
import Event from '../../public/src/views/Entity/Event';
import Organization from '../../public/src/views/Entity/Organization/league.jsx';
import Person from '../../public/src/views/Entity/Person';
import Team from '../../public/src/views/Entity/Team';
import { formatRoute } from '../../public/common/utils/stringFormat';

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function EntityRoute() {
  const router = useRouter();
  const { id } = router.query;

  const { response, isLoading } = useApiRoute(formatRoute('/api/entity/events', null, { id }), {
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
