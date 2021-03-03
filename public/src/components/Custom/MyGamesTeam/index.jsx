import React, { useMemo } from 'react';
import CustomCard from '../Card';
import Typography from '@material-ui/core/Typography';

import { CARD_TYPE_ENUM, TABS_ENUM } from '../../../../common/enums';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

export default function MyGamesTeam(props) {
  const { t } = useTranslation();
  const { gamesInfos } = props;

  const onGameClick = (eventId) => {
    goTo(ROUTES.entity, { id: eventId }, { tabs: TABS_ENUM.SCHEDULE });
  };

  const games = useMemo(
    () =>
      gamesInfos?.map((game) => {
        const teams = [
          { name: game.team_names[0], score: game.team_scores[0] },
          { name: game.team_names[1], score: game.team_scores[1] },
        ];
        return { ...game, teams };
      }),
    [gamesInfos]
  );

  return (
    <div>
      <Typography variant="h6" color="textPrimary" style={{ marginBottom: 4 }}>
        {t('future_games')}
      </Typography>
      {games?.length ? (
        games.map((game) => (
          <CustomCard
            key={game.id}
            items={{
              ...game,
              onClick: onGameClick,
            }}
            type={CARD_TYPE_ENUM.TWO_TEAM_GAME}
          />
        ))
      ) : (
        <Typography color="textSecondary">{t('no.no_games')}</Typography>
      )}
    </div>
  );
}
