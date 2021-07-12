import React, { useEffect, useState, useContext } from 'react';
import styles from './ScheduleManagerMobile.module.css';
import { useTranslation } from 'react-i18next';
import AddGame from './AddGame';
import AddTimeSlot from './AddTimeSlot';
import AddField from './AddField';
import { Games } from '../../../../typescript/types';
import Button from '../../components/Custom/Button';
import IconButton from '../../components/Custom/IconButton';
import { Store } from '../../Store';
import { getGames as getGamesApi } from '../../actions/service/entity/get';
import Typography from '@material-ui/core/Typography';

interface IProps {
  update: () => void;
}

const ScheduleManagerMobile: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { update } = props;

  const [game, setGame] = useState<boolean>(false);
  const [games, setGames] = useState<Games[]>([]);
  const [time, setTime] = useState<boolean>(false);
  const [field, setField] = useState<boolean>(false);

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [game, eventId]);

  const getGames = async (): Promise<void> => {
    getGamesApi(eventId).then(setGames);
  };

  const updateGames = async (): Promise<void> => {
    await getGames();
  };

  return (
    <>
      <div className={styles.div}>
        <IconButton
          className={styles.iconButton}
          icon="ArrowBack"
          onClick={(): void => {
            history.back();
          }}
          tooltip={t('back')}
          style={{ color: 'primary' }}
        />
        <Typography className={styles.typography}>{t('complete_schedule_manager')}</Typography>
        <Button
          endIcon="Add"
          onClick={(): void => {
            setTime(true);
          }}
          className={styles.button}
        >
          {t('add.add_time_slot')}
        </Button>
        <Button
          endIcon="Add"
          onClick={(): void => {
            setField(true);
          }}
          className={styles.button}
        >
          {t('add.add_field')}
        </Button>
        <Button
          endIcon="Add"
          onClick={(): void => {
            setGame(true);
          }}
          className={styles.button}
        >
          {t('add.add_game')}
        </Button>
      </div>
      <AddTimeSlot
        isOpen={time}
        onClose={(): void => {
          setTime(false);
        }}
      />
      <AddField
        isOpen={field}
        onClose={(): void => {
          setField(false);
        }}
      />
      <AddGame
        isOpen={game}
        onClose={(): void => {
          setGame(false);
        }}
        update={update}
        updateGames={updateGames}
        games={games}
      />
    </>
  );
};
export default ScheduleManagerMobile;
