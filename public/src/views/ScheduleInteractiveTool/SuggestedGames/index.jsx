import React, { useEffect, useState } from 'react';
import styles from './SuggestedGames.module.css';
import SuggestedGameCard from './SuggestedGameCard';
import Typography from '@material-ui/core/Typography';
import Button from '../../../components/Custom/Button';

export default function SuggestedGames(props) {
  const { suggestions, setNewIndex } = props;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [suggestions.length]);

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
          Il n y a aucune partie a suggéré. Ajoutez des phases.
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
        Cliquez sur un boutton + afin d ajouter cette partie à l événement
      </Typography>
      <Button endIcon="ArrowForward" className={styles.button} onClick={handleSkip}>
        Passer
      </Button>
    </div>
  );
}
