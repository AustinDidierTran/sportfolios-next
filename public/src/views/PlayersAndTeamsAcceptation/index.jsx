import React, { useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TinderCard from 'react-tinder-card';
import Card from '../../components/Custom/Card';
import IconButton from '../../components/Custom/IconButton';
import Button from '../../components/Custom/Button';
import styles from './PlayersAndTeamsAcceptation.module.css';
import { DIRECTION_ENUM, SEVERITY_ENUM } from '../../../common/enums';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ACTION_ENUM, Store } from '../../Store';
import IgContainer from '../../components/Custom/IgContainer';

const alreadyRemoved = [];

export default function PlayersAndTeamsAcceptation(props) {
  const { cards: cardsProps } = props;
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const [noCards, setNoCards] = useState(false);

  const swiped = (direction, id) => {
    if (direction === DIRECTION_ENUM.RIGHT) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_accepted'),
        severity: SEVERITY_ENUM.SUCCESS,
        vertical: 'top',
      });
    }
    if (direction === DIRECTION_ENUM.LEFT) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_refused'),
        severity: SEVERITY_ENUM.ERROR,
        vertical: 'top',
      });
    }
    alreadyRemoved.push(id);
    if (alreadyRemoved.length === cards.length) {
      setNoCards(true);
    }
  };

  const swipe = (dir) => {
    const cardsLeft = cards.filter((card) => !alreadyRemoved.includes(card.items.id));
    const index = cards.findIndex((card) => card.items.id === cardsLeft[0].items.id);
    childRefs[index].current.swipe(dir);
  };

  const cards = useMemo(() => {
    if (cardsProps) {
      return cardsProps.map((card) => ({ items: { ...card.items, swipe }, type: card.type }));
    }
    return [];
  }, [cardsProps]);

  const childRefs = useMemo(() => {
    if (cards) {
      return Array(cards.length)
        .fill(0)
        .map((i) => React.createRef());
    }
    return [];
  }, [cards]);

  if (noCards || !cards) {
    return (
      <IgContainer className={styles.IgContainer}>
        <div className={styles.iconButton}>
          <IconButton
            icon="ArrowBack"
            onClick={() => {
              history.back();
            }}
            tooltip={t('back')}
            style={{ color: 'primary' }}
          />
          <Typography color="textSecondary">{cards[0]?.items.event.name}</Typography>
        </div>
        <Typography variant="h5" className={styles.text} color="textSecondary">
          {t('there_is_no_more_team_to_accept')}
        </Typography>
      </IgContainer>
    );
  }

  return (
    <IgContainer className={styles.IgContainer}>
      <div className={styles.iconButton}>
        <IconButton
          icon="ArrowBack"
          onClick={() => {
            history.back();
          }}
          tooltip={t('back')}
          style={{ color: 'primary' }}
        />
        <Typography color="textSecondary">{cards[0]?.items.event.name}</Typography>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex' }}>
          {cards.map((card, index) => (
            <div key={card.items.id}>
              <TinderCard
                ref={childRefs[index]}
                onSwipe={(dir) => swiped(dir, card.items.id)}
                preventSwipe={['up', 'down']}
              >
                <Card type={card?.type} items={card?.items} />
              </TinderCard>
            </div>
          ))}
        </div>
        <Container className={styles.div}>
          <div className={styles.buttons}>
            <Button
              onClick={() => {
                swipe(DIRECTION_ENUM.LEFT);
              }}
              color={'secondary'}
              className={styles.button}
            >
              {t('decline')}
            </Button>
            <Button
              onClick={() => {
                swipe(DIRECTION_ENUM.RIGHT);
              }}
              className={styles.button}
            >
              {t('accept')}
            </Button>
          </div>
        </Container>
      </div>
    </IgContainer>
  );
}
