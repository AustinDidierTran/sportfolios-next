import React, { useState, useEffect } from 'react';
import Error from 'next/error';
import { GLOBAL_ENUM, STATUS_ENUM } from '../../public/common/enums';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../public/common/utils/stringFormat';
import api from '../../public/src/actions/api';

const Head = loadable(() => import('next/head'));
const Event = loadable(() => import('../../public/src/views/Entity/Event/home.jsx'));
const Organization = loadable(() => import('../../public/src/views/Entity/Organization/home.jsx'));
const Person = loadable(() => import('../../public/src/views/Entity/Person'));
const Team = loadable(() => import('../../public/src/views/Entity/Team'));

const EntityMap = {
  [GLOBAL_ENUM.PERSON]: Person,
  [GLOBAL_ENUM.ORGANIZATION]: Organization,
  [GLOBAL_ENUM.TEAM]: Team,
  [GLOBAL_ENUM.EVENT]: Event,
};

export default function EntityRoute({ response: responseProps }) {
  const { t } = useTranslation();

  const [response, setResponse] = useState(responseProps);

  useEffect(() => {
    if (!response.basicInfos.role || response.basicInfos.role === -1) getRole();
  });

  const getRole = async () => {
    const res = await api(formatRoute('/api/entity/role', null, { entityId: response.basicInfos.id }));
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      let newResponse = response;
      newResponse.basicInfos.role = res.data;
      setResponse(newResponse);
    }
  };

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
        <meta property="og:title" content={t('metadata.[id].home.title')} />
        <meta property="og:description" content={t('metadata.[id].home.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
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
  const res = await api(formatRoute('/api/entity/about', null, { id: context.params.id }), {
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
