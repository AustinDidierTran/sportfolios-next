import React, { useMemo, useState } from 'react';
import CustomCard from '../Card';
import Typography from '@material-ui/core/Typography';
import styles from './MyGames.module.css';

import { CARD_TYPE_ENUM, TABS_ENUM } from '../../../../common/enums';
import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import CustomButton from '../Button';
import CreatePractice from './CreatePractice';

export default function MyGamesTeam(props) {
  const { t } = useTranslation();
  const { gamesInfos, adminView } = props;

  const [openPractice, setOpenPractice] = useState(false);

  const onGameClick = (eventId) => {
    goTo(ROUTES.entity, { id: eventId }, { tabs: TABS_ENUM.SCHEDULE });
  };

  const createPractice = () => {
    setOpenPractice(true);
  };

  const closePractice = () => {
    setOpenPractice(false);
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
      {adminView && (
        <div className={styles.buttons}>
          <CustomButton onClick={createPractice} endIcon="Add" color="primary" className={styles.button}>
            {t('create.create_practice')}
          </CustomButton>
        </div>
      )}
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
      <CreatePractice isOpen={openPractice} onClose={closePractice} />
    </div>
  );
}
