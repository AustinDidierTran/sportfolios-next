import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../public/common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';
import TeamsAcceptation from '../../../public/src/views/TeamsAcceptation';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const TeamsAcceptationRoute = () => {
  const router = useRouter();
  const { id: eventId, rosterId } = router.query;
  const [cards, setCards] = useState([]);
  const { t } = useTranslation();

  const update = async (rosterId, registrationStatus) => {
    await api('/api/entity/teamAcceptation', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        rosterId,
        registrationStatus,
      }),
    });
  };

  const getCardsInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsPending', null, {
        eventId,
      })
    );

    const teams = data?.map((t) => {
      return { items: t, type: CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS };
    });
    if (rosterId) {
      teams?.sort((a, b) => {
        return a.items.id == rosterId ? -1 : b.items.id == rosterId ? 1 : 0;
      });
    }
    setCards(teams);
  };

  useEffect(() => {
    if (eventId) {
      getCardsInfos();
    }
  }, [eventId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.teamsAcceptation.title')} />
        <meta property="og:description" content={t('metadata.teamsAcceptation.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210213-xfi77-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <TeamsAcceptation cards={cards} update={update} />
    </>
  );
};

export default TeamsAcceptationRoute;
