import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { Store } from '../../../Store';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../utils/stringFormats';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import Player from './Player';

export default function Players(props) {
  const { adminView } = props;
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState([]);

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
        <List className={styles.list}>
          {players.map((player, index) => (
            <Player player={player} index={index} key={player.id} update={getPlayers} isAdmin={adminView} />
          ))}
        </List>
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
