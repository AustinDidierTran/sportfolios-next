import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../actions/api';
import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import FormDialog from '../../components/Custom/FormDialog';
import { Store } from '../../Store';
import { formatRoute } from '../../utils/stringFormats';
import Players from './Players';
import styles from './TeamRosters.module.css';
import { FORM_DIALOG_TYPE_ENUM } from '../../../common/enums';

export default function TabTeamRosters(props) {
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);
  const { adminView } = props;

  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/players', null, {
        teamId,
      })
    );
    setPlayers(data);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper title={t('players')}>
        {adminView ? (
          <Button
            className={styles.button}
            onClick={() => {
              setOpen(true);
            }}
          >
            {t('add.add_player')}
          </Button>
        ) : (
          <></>
        )}
        <Players players={players} />
      </Paper>
      <FormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_PLAYER}
        items={{
          open,
          onClose,
          update: getPlayers,
          players,
        }}
      />
    </>
  );
}
