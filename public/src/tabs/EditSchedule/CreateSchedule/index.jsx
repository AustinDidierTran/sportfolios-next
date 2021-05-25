import React, { useEffect, useState, useContext } from 'react';
import { Button } from '../../../components/Custom';
import styles from '../EditSchedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddPhase from './AddPhase';
import AddTimeSlot from './AddTimeSlot';
import AddTeam from './AddTeam';
import AddField from './AddField';
import { goTo, ROUTES } from '../../../actions/goTo';
import api from '../../../actions/api';
import { formatRoute } from '../../../utils/stringFormats';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { Store } from '../../../Store';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { update } = props;
  const [width] = useWindowSize();

  const [game, setGame] = useState(false);
  const [games, setGames] = useState([]);
  const [phase, setPhase] = useState(false);
  const [time, setTime] = useState(false);
  const [team, setTeam] = useState(false);
  const [field, setField] = useState(false);

  useEffect(() => {
    if (eventId) {
      getGames();
    }
  }, [game, eventId]);

  const getGames = async () => {
    const { data } = await api(formatRoute('/api/entity/games', null, { eventId }));
    setGames(data);
  };

  const openGame = () => {
    setGame(true);
  };
  const closeGame = () => {
    setGame(false);
  };
  const openPhase = () => {
    setPhase(true);
  };
  const closePhase = () => {
    setPhase(false);
  };
  const openTime = () => {
    setTime(true);
  };
  const closeTime = () => {
    setTime(false);
  };
  const openTeam = () => {
    setTeam(true);
  };
  const closeTeam = () => {
    setTeam(false);
  };
  const openField = () => {
    setField(true);
  };
  const closeField = () => {
    setField(false);
  };
  const updateGames = async () => {
    await getGames();
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openTime}
        className={styles.button}
      >
        {t('add.add_time_slot')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openField}
        className={styles.button}
      >
        {t('add.add_field')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openTeam}
        className={styles.button}
      >
        {t('add.add_team')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openPhase}
        className={styles.button}
      >
        {t('add.add_phase')}
      </Button>
      <Button
        size="small"
        variant="contained"
        endIcon="Add"
        style={{ margin: '8px' }}
        onClick={openGame}
        className={styles.button}
      >
        {t('add.add_game')}
      </Button>
      {width < MOBILE_WIDTH ? (
        <></>
      ) : (
        <Button
          size="small"
          variant="contained"
          endIcon="Build"
          style={{ margin: '8px' }}
          onClick={() => goTo(ROUTES.scheduleInteractiveTool, { id: eventId })}
          className={styles.button}
        >
          {t('interactive_tool')}
        </Button>
      )}
      <AddTimeSlot isOpen={time} onClose={closeTime} />
      <AddField isOpen={field} onClose={closeField} />
      <AddTeam isOpen={team} onClose={closeTeam} update={update} />
      <AddPhase isOpen={phase} onClose={closePhase} />
      <AddGame isOpen={game} onClose={closeGame} update={update} updateGames={updateGames} games={games} />
    </>
  );
}
