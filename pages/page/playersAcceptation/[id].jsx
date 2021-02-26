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
  const { t } = useTranslation();

  const { id: eventId } = router.query;
  const [cards, setCards] = useState([]);

  const getCardsInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/playersPending', null, {
        eventId,
      })
    );

    const players = data?.map((p) => {
      return { items: p, type: CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS };
    });
    setCards(players);
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
      <PlayersAcceptation card={cards} />
    </>
  );
};

export default PlayersAcceptationRoute;
