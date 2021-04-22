import React, { useEffect, useState, useMemo } from 'react';
import styles from './SuggestedGames.module.css';
import Typography from '@material-ui/core/Typography';
import Button from '../../../components/Custom/Button';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

const SuggestedGameCard = dynamic(() => import('./SuggestedGameCard'));

export default function SuggestedGames(props) {
  const { suggestions, setNewIndex } = props;
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === suggestions.length) {
      setIndex(0);
      setNewIndex(0);
    }
    setIndex(0);
    setNewIndex(0);
  }, [suggestions.length, suggestions]);

  const overrideIndex = useMemo(() => index === suggestions.length, [suggestions.length]);

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
          ranking1={overrideIndex ? suggestions[0].rankings[0] : suggestions[index].rankings[0]}
          ranking2={overrideIndex ? suggestions[0].rankings[1] : suggestions[index].rankings[1]}
          phaseStatus={overrideIndex ? suggestions[0].status : suggestions[index].status}
          phaseName={overrideIndex ? suggestions[0].phaseName : suggestions[index].phaseName}
          phaseOrder={overrideIndex ? suggestions[0].phaseOrder : suggestions[index].phaseOrder}
        />
      </div>
      <div className={styles.textBox}>
        <Typography color="textSecondary" className={styles.text}>
          {t('click_to_add_game')}
        </Typography>
      </div>
      <div>
        <Button endIcon="ArrowForward" onClick={handleSkip}>
          {t('skip')}
        </Button>
      </div>
    </div>
  );
}
