import React, { useEffect, useMemo, useContext, useState } from 'react';

import Card from '../../../../../components/Custom/Card';
import { CARD_TYPE_ENUM } from '../../../../../../common/enums';
import { useRouter } from 'next/router';

export default function Game(props) {
  const { game, isPastGame } = props;
  const router = useRouter();

  const openGameDetailed = async () => {
    router.push({
      pathname: router.query.id,
      query: {
        tab: router.query.tab,
        gameId: game.id,
      },
    });
  };

  return (
    <>
      <Card
        items={{
          ...game,
          isPastGame,
          onClick: openGameDetailed,
        }}
        type={CARD_TYPE_ENUM.MULTIPLE_TEAM_GAME}
      />
    </>
  );
}
