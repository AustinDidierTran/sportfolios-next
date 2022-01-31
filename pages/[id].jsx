import React from 'react';

import { GLOBAL_ENUM, IMAGE_ENUM } from '../public/common/enums';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { CLIENT_BASE_URL } from '../conf';
import { NextSeo } from 'next-seo';
import { getEntity, getRealEntityId } from '../public/src/actions/service/entity/get';

const Error = dynamic(() => import('next/error'));
const Event = dynamic(() => import('../public/src/views/Entity/Event'));
const Game = dynamic(() => import('../public/src/views/Entity/Event/Game'));
const Organization = dynamic(() => import('../public/src/views/Entity/Organization'));
const Person = dynamic(() => import('../public/src/views/Entity/Person'));
const Team = dynamic(() => import('../public/src/views/Entity/Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function EntityRoute({ response }) {
  const { t } = useTranslation();

  if (response.type === GLOBAL_ENUM.EVENT) {
    if (response.eventType === 'game') {
      return <Game {...response} />;
    }
  }

  const type = response.basicInfos?.type || response.type;

  const EntityObject = EntityMap[type];

  if (!response || !EntityObject) {
    return <Error />;
  }

  const img = response.basicInfos.photoUrl || IMAGE_ENUM.SPORTFOLIOS_BANNER;
  const description = response.basicInfos.quickDescription
    ? decodeURIComponent(response.basicInfos.quickDescription)
    : t('metadata.[id].home.description');
  const name = response.basicInfos.name;

  return (
    <>
      <NextSeo
        title={name}
        description={description}
        canonical={CLIENT_BASE_URL}
        openGraph={{
          type: 'website',
          url: `${CLIENT_BASE_URL}/${response.basicInfos.id}`,
          title: name,
          description: description,
          images: [
            {
              url: img,
            },
          ],
          site_name: 'Sportfolios',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content:
              'Sportfolios.app, Sport, Organization, Athlete, Coach, Schedule, Registration, Results, Statistics, Coaching, Information, Management',
          },
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
        ]}
        facebook={{ appId: '346677216672687' }}
        twitter={{
          site: '@sportfoliosapp',
          cardType: 'summary_large_image',
        }}
      />
      <EntityObject {...response} />
    </>
  );
}

export async function getServerSideProps(context) {
  const id = await getRealEntityId(context.params.id);

  const entity = await getEntity(id);

  if (!entity) {
    return {
      notFound: true,
    };
  }
  return {
    props: { response: entity }, // will be passed to the page component as props
  };
}
