import React, { useEffect } from 'react';
import styles from './SuggestedGames.module.css';
import Typography from '@material-ui/core/Typography';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const SuggestedGameCard = dynamic(() => import('./SuggestedGameCard'));

export default function SuggestedGames(props) {
  const { suggestions, index, setNewIndex } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (index === suggestions.length) {
      setNewIndex(0);
    }
  }, [suggestions.length]);

  const handleNext = () => {
    if (index === suggestions.length - 1) {
      setNewIndex(0);
    } else {
      setNewIndex(index + 1);
    }
  };

  const handleBack = () => {
    if (index === 0) {
      setNewIndex(suggestions.length - 1);
    } else {
      setNewIndex(index - 1);
    }
  };

  if (suggestions.length === 0 || !suggestions[0]) {
    return (
      <div className={styles.warning}>
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
          phaseName={suggestions[index].phaseName}
          phaseOrder={suggestions[index].phaseOrder}
        />
      </div>
      <div className={styles.buttons}>
        <div className={styles.back}>
          <Button startIcon="ArrowBack" onClick={handleBack}>
            {t('back')}
          </Button>
        </div>
        <div className={styles.next}>
          <Button endIcon="ArrowForward" onClick={handleNext}>
            {t('next')}
          </Button>
        </div>
      </div>
      <div className={styles.textBox}>
        <Typography color="textSecondary" className={styles.text}>
          {t('click_to_add_game')}
        </Typography>
      </div>
    </div>
  );
}
