import React from 'react';
import Error from 'next/error';
import { GLOBAL_ENUM } from '../public/common/enums';
import loadable from '@loadable/component';
import { formatRoute } from '../public/common/utils/stringFormat';
import { useTranslation } from 'react-i18next';
import api from '../public/src/actions/api';
import Head from 'next/head';

const Event = loadable(() => import('../public/src/views/Entity/Event'));
const Organization = loadable(() => import('../public/src/views/Entity/Organization'));
const Person = loadable(() => import('../public/src/views/Entity/Person'));
const Team = loadable(() => import('../public/src/views/Entity/Team'));

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
    return (
      <>
        <Head>
          <meta property="og:title" content={t('metadata.[id].home.title')} />
          <meta property="og:description" content={t('metadata.[id].home.description')} />
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
        <meta property="og:title" content={response.basicInfos.name} />
        <meta
          property="og:description"
          content={
            response.basicInfos.quickDescription ||
            response.basicInfos.description ||
            t('metadata.[id].home.description')
          }
        />
        <meta
          property="og:image"
          content={
            response.basicInfos.photoUrl ||
            'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73'
          }
        />
      </Head>
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
  };
}
