import React from 'react';
import styles from './EditGames.module.css';
import Typography from '@material-ui/core/Typography';
import ScoreSuggestion from './ScoreSuggestion';
import { useTranslation } from 'react-i18next';
import { Games } from '../../../../../../typescript/types';

interface IProps {
  games: Games[];
  isOpen: boolean;
  update: any;
}

const EditGames: React.FunctionComponent<IProps> = (props) => {
  const { games, isOpen, update } = props;
  const { t } = useTranslation();

  return (
    <>
      {isOpen ? (
        <div className={styles.games}>
          {games.length ? (
            <>
              {games.map((game) => (
                <ScoreSuggestion game={game} update={update} key={game.id} />
              ))}
            </>
          ) : (
            <Typography color="textSecondary">{t('no.no_games')}</Typography>
          )}
        </div>
      ) : null}
    </>
  );
};
export default EditGames;
