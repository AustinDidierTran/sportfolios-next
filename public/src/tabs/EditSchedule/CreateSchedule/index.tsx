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
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { Store } from '../../../Store';
import { getGames as getGamesApi } from '../../../actions/service/entity/get';
import { Games } from '../../../../../typescript/types';

interface IProps {
  update: () => void;
}

const ScheduleTab: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { update } = props;
  const [width] = useWindowSize();

  const [game, setGame] = useState<boolean>(false);
  const [games, setGames] = useState<Games[]>([]);
  const [phase, setPhase] = useState<boolean>(false);
  const [time, setTime] = useState<boolean>(false);
  const [team, setTeam] = useState<boolean>(false);
  const [field, setField] = useState<boolean>(false);

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [game, eventId]);

  const getGames = async (): Promise<void> => {
    getGamesApi(eventId).then(setGames);
  };

  const openGame = (): void => {
    setGame(true);
  };
  const closeGame = (): void => {
    setGame(false);
  };
  const openPhase = (): void => {
    setPhase(true);
  };
  const closePhase = (): void => {
    setPhase(false);
  };
  const openTime = (): void => {
    setTime(true);
  };
  const closeTime = (): void => {
    setTime(false);
  };
  const openTeam = (): void => {
    setTeam(true);
  };
  const closeTeam = (): void => {
    setTeam(false);
  };
  const openField = (): void => {
    setField(true);
  };
  const closeField = (): void => {
    setField(false);
  };
  const updateGames = async (): Promise<void> => {
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
};
export default ScheduleTab;
