import React, { useEffect, useMemo, useContext, useState } from 'react';

import Card from '../../../../../components/Custom/Card';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../../../Store';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { CARD_TYPE_ENUM, SEVERITY_ENUM } from '../../../../../../common/enums';

export default function Game(props) {
  const { game, isPastGame } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const openGameDetailed = async () => {
    //if there is no teams in the game yet, no need to see the detailed view
    if (!game.positions[0].roster_id || !game.positions[1].roster_id) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_details_available'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      router.push({
        pathname: router.query.id,
        query: {
          tab: router.query.tab,
          gameId: game.id,
        },
      });
    }
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
