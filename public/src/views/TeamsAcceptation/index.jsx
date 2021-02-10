import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../common/enums';
import api from '../../actions/api';
import PlayersAndTeamsAcceptation from '../PlayersAndTeamsAcceptation';

export default function TeamsAcceptation() {
  const router = useRouter();
  const { id: eventId, teamId } = router.query;
  const [cards, setCards] = useState([]);

  const getCardsInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsPending', null, {
        eventId,
      })
    );

    const teams = data?.map((t) => {
      return { items: t, type: CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS };
    });
    if (teamId) {
      teams.sort((a, b) => {
        return a.items.id == teamId ? -1 : b.items.id == teamId ? 1 : 0;
      });
    }
    setCards(teams);
  };

  useEffect(() => {
    if (eventId) {
      getCardsInfos();
    }
  }, [eventId]);

  return <PlayersAndTeamsAcceptation cards={cards} />;
}
