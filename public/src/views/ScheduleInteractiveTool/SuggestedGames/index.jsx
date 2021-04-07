import React, { useEffect, useState } from 'react';
import styles from './SuggestedGames.module.css';
import SuggestedGameCard from './SuggestedGameCard';
import Typography from '@material-ui/core/Typography';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';

export default function SuggestedGames(props) {
  const { suggestions, setNewIndex } = props;
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [suggestions.length, suggestions]);

  const handleSkip = () => {
    if (index === suggestions.length - 1) {
      setIndex(0);
      setNewIndex(0);
    } else {
      setIndex(index + 1);
      setNewIndex(index + 1);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className={styles.div}>
        <Typography color="textSecondary" className={styles.text}>
          {t('no.no_game_suggestions')}
        </Typography>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.div}>
        <SuggestedGameCard
          ranking1={suggestions[index].rankings[0]}
          ranking2={suggestions[index].rankings[1]}
          phaseStatus={suggestions[index].status}
          className={styles.game}
        />
      </div>
      <Typography color="textSecondary" className={styles.text}>
        {t('click_to_add_game')}
      </Typography>
      <Button endIcon="ArrowForward" className={styles.button} onClick={handleSkip}>
        {t('skip')}
      </Button>
    </div>
  );
}
