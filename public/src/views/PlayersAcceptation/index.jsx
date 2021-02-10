import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../common/enums';
import api from '../../actions/api';
import PlayersAndTeamsAcceptation from '../PlayersAndTeamsAcceptation';

export default function PlayersAcceptation(props) {
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
    getCardsInfos();
  }, []);

  return <PlayersAndTeamsAcceptation cards={cards} />;
}
