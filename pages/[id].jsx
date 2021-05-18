import React from 'react';

import { GLOBAL_ENUM } from '../public/common/enums';
import dynamic from 'next/dynamic';
import { formatRoute } from '../public/src/utils/stringFormats';
import { useTranslation } from 'react-i18next';
import api from '../public/src/actions/api';
import { CLIENT_BASE_URL } from '../conf';
import { NextSeo } from 'next-seo';

const Error = dynamic(() => import('next/error'));
const Event = dynamic(() => import('../public/src/views/Entity/Event'));
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

  const EntityObject = EntityMap[response.basicInfos.type];

  if (!response || !EntityObject) {
    return <Error />;
  }

  const img =
    response.basicInfos.photoUrl ||
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73';
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
              'Sportfolios.app, Sport, Organization, Athlete, Coach, Schedule, Registration, Results, Statistics, Coaching, Information, Gestion',
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

export async function getStaticPaths() {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
}

export async function getStaticProps(context) {
  const res = await api(formatRoute('/api/entity', null, { id: context.params.id }), {
    defaultValue: {},
  });

  if (!res) {
    return {
      notFound: true,
    };
  }
  return {
    props: { response: res.data }, // will be passed to the page component as props
    revalidate: 1, // In seconds
  };
}
