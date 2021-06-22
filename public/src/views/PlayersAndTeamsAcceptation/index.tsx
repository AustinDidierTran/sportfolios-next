import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TinderCard from 'react-tinder-card';
import Card from '../../components/Custom/Card';
import IconButton from '../../components/Custom/IconButton';
import Button from '../../components/Custom/Button';
import styles from './PlayersAndTeamsAcceptation.module.css';
import { DIRECTION_ENUM, STATUS_ENUM } from '../../../common/enums';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IgContainer from '../../components/Custom/IgContainer';

interface IProps {
  cards: any;
  update: (cartItemsId: string, status: string) => void;
  getCards: () => void;
  name: string;
}

const PlayersAndTeamsAcceptation: React.FunctionComponent<IProps> = (props) => {
  const { cards: cardsProps, update, getCards, name } = props;
  const { t } = useTranslation();

  const [noCards, setNoCards] = useState(false);
  const [cards, setCards] = useState([]);
  const [alreadyRemoved, setAlreadyRemoved] = useState([]);

  // const checkKey = (e) => {
  //   e = e || window.event;

  //   if (e.keyCode == '38') {
  //     swipe(DIRECTION_ENUM.UP);
  //   } else if (e.keyCode == '37') {
  //     swipe(DIRECTION_ENUM.LEFT);
  //   } else if (e.keyCode == '39') {
  //     swipe(DIRECTION_ENUM.RIGHT);
  //   }
  // };

  useEffect(() => {
    getCards();
    // if (document) {
    //   document.onkeydown = checkKey;
    // }
    if (window) {
      window.onbeforeunload = onExit;
    }
  }, []);

  useEffect(() => {
    if (!cards || !cards.length) {
      setNoCards(true);
    } else {
      setNoCards(false);
    }
  }, [cards]);

  useEffect(() => {
    if (cardsProps && cardsProps.length) {
      setCards(cardsProps.map((card: any) => ({ items: { ...card.items, swipe }, type: card.type })));
    }
  }, [cardsProps]);

  const childRefs = useMemo(() => {
    if (cards) {
      return Array(cards.length)
        .fill(0)
        .map(() => React.createRef());
    }
    return [];
  }, [cards]);

  const onExit = () => {
    setCards([]);
    setAlreadyRemoved([]);
  };

  const swiped = (direction: string, id: string): void => {
    const card = cards.find((card) => {
      return card.items.id === id;
    });
    if (direction === DIRECTION_ENUM.RIGHT) {
      update(card.items.id, STATUS_ENUM.ACCEPTED);
    }
    if (direction === DIRECTION_ENUM.LEFT) {
      update(card.items.id, STATUS_ENUM.REFUSED);
    }
    if (direction === DIRECTION_ENUM.UP) {
      update(card.items.id, STATUS_ENUM.UNCHANGED);
    }
    alreadyRemoved.push(id);
    if (alreadyRemoved.length === cards.length) {
      setNoCards(true);
    }
  };

  const swipe = (dir: string): void => {
    if (alreadyRemoved.length === cards.length) {
      return;
    }
    const cardsLeft = cards.filter((card) => !alreadyRemoved.includes(card.items.id));
    const index = cards.findIndex((card) => card.items.id === cardsLeft[0].items.id);
    //@ts-ignore
    childRefs[index].current.swipe(dir);
  };

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
          <Typography color="textSecondary">{name}</Typography>
        </div>
        <Typography variant="h5" className={styles.text} color="textSecondary">
          {t('you.you_swiped_everyone')}
        </Typography>
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              location.reload();
            }}
            color={'primary'}
            className={styles.refreshButton}
          >
            {t('refresh')}
          </Button>
        </div>
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
        <Typography color="textSecondary">{name}</Typography>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex' }}>
          {cards.map((card, index) => (
            <div key={card.items.id}>
              {/* @ts-ignore */}
              <TinderCard ref={childRefs[index]} onSwipe={(dir) => swiped(dir, card.items.id)} preventSwipe={['down']}>
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
                swipe(DIRECTION_ENUM.UP);
              }}
              color={'default'}
              className={styles.button}
            >
              {t('skip')}
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
};
export default PlayersAndTeamsAcceptation;
