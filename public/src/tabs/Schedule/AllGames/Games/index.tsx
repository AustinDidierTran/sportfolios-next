import React from 'react';
import styles from './Games.module.css';
import Game from './Game';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import { Games as IGames } from '../../../../../../typescript/types';

interface IProps {
  games: IGames[];
  isOpen: boolean;
}

const Games: React.FunctionComponent<IProps> = (props) => {
  const { games, isOpen } = props;
  const { t } = useTranslation();

  return (
    <>
      {isOpen ? (
        <div>
          <Divider className={styles.divider} />
          <div className={styles.games}>
            {games.length ? (
              games.map((game) => <Game game={game} key={game.id} />)
            ) : (
              <Typography color="textSecondary">{t('no.no_games')}</Typography>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default Games;
