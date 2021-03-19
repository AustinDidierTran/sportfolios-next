import React from 'react';
import Error from 'next/error';
import loadable from '@loadable/component';
import { GLOBAL_ENUM } from '../../public/common/enums';
import { useApiRoute } from '../../public/src/hooks/queries';
import LoadingSpinner from '../../public/src/components/Custom/LoadingSpinner';
import { useRouter } from 'next/router';
import { formatRoute } from '../../public/common/utils/stringFormat';
const Head = loadable(() => import('next/head'));
import { useTranslation } from 'react-i18next';

const Event = loadable(() => import('../../public/src/views/Entity/Event/editRankings'));
const Organization = loadable(() => import('../../public/src/views/Entity/Organization/home.jsx'));
const Person = loadable(() => import('../../public/src/views/Entity/Person'));
const Team = loadable(() => import('../../public/src/views/Entity/Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function EntityRoute() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const { response, isLoading } = useApiRoute(formatRoute('/api/entity/editRankings', null, { id }), {
    defaultValue: {},
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.[id].editRankings.title')} />
          <meta property="og:description" content={t('metadata.[id].editRankings.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
        </Head>
        <LoadingSpinner />
      </>
    );
  }
  if (!response) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.[id].editRankings.title')} />
          <meta property="og:description" content={t('metadata.[id].editRankings.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
        </Head>
        <Error />
      </>
    );
  }

  const EntityObject = EntityMap[response.basicInfos.type];

  if (!EntityObject) {
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.[id].editRankings.title')} />
          <meta property="og:description" content={t('metadata.[id].editRankings.description')} />
          <meta
            property="og:image"
            content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
          />
        </Head>
        <Error />
      </>
    );
  }
  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.[id].editRankings.title')} />
        <meta property="og:description" content={t('metadata.[id].editRankings.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <EntityObject {...response} />
    </>
  );
}
