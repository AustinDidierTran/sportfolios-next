import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import PlayersAcceptation from '../../../public/src/views/PlayersAcceptation';
import { formatRoute } from '../../../public/common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

const PlayersAcceptationRoute = () => {
  const router = useRouter();
  const { id: eventId, personId } = router.query;
  const [cards, setCards] = useState([]);
  const { t } = useTranslation();

  const update = async (personId, registrationStatus) => {
    await api('/api/entity/playerAcceptation', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        personId,
        registrationStatus,
      }),
    });
  };

  const getCardsInfos = async () => {
    if (eventId) {
      const { data } = await api(
        formatRoute('/api/entity/playersPendingAndRefused', null, {
          eventId,
        })
      );

      const pending = data.pending?.map((p) => {
        return { items: p, type: CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS };
      });
      const refused = data.refused?.map((t) => {
        return { items: t, type: CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS };
      });
      const players = pending.concat(refused);

      if (personId) {
        players?.sort((a, b) => {
          return a.items.id == personId ? -1 : b.items.id == personId ? 1 : 0;
        });
      }
      setCards(players);
    }
  };

  useEffect(() => {
    if (eventId) {
      getCardsInfos();
    }
  }, [eventId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.playersAcceptation.title')} />
        <meta property="og:description" content={t('metadata.playersAcceptation.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <PlayersAcceptation cards={cards} update={update} getCards={getCardsInfos} />
    </>
  );
};

export default PlayersAcceptationRoute;
