import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import PlayersAcceptation from '../../../public/src/views/PlayersAcceptation';
import { formatRoute } from '../../../public/common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';

const PlayersAcceptationRoute = () => {
  const router = useRouter();

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

  return <PlayersAcceptation card={cards} />;
};

export default PlayersAcceptationRoute;
