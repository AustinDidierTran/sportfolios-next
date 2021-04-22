import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/Custom';
import styles from '../EditSchedule.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddPhase from './AddPhase';
import AddTimeSlot from './AddTimeSlot';
import AddTeam from './AddTeam';
import AddField from './AddField';
import { goTo, ROUTES } from '../../../actions/goTo';
import { SCREENSIZE_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { useWindowSize } from '../../../hooks/window';

export default function ScheduleTab(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId, id } = router.query;
  const { update } = props;
  const [width] = useWindowSize();

  const [game, setGame] = useState(false);
  const [games, setGames] = useState([]);
  const [phase, setPhase] = useState(false);
  const [time, setTime] = useState(false);
  const [team, setTeam] = useState(false);
  const [field, setField] = useState(false);

  useEffect(() => {
    getGames();
  }, [game]);

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
      {width === SCREENSIZE_ENUM.sm || width === SCREENSIZE_ENUM.xs ? (
        <></>
      ) : (
        <Button
          size="small"
          variant="contained"
          endIcon="Build"
          style={{ margin: '8px' }}
          onClick={() => goTo(ROUTES.scheduleInteractiveTool, { id })}
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
