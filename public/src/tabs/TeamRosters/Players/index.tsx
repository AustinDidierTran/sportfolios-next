import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { Store } from '../../../Store';
import { FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import Player from './Player';
import { Player as PlayerType } from '../../../../../typescript/types';
import { getPlayers as getPlayersApi } from '../../../actions/service/entity';

interface IProps {
  adminView: boolean;
}

const Players: React.FunctionComponent<IProps> = (props) => {
  const { adminView } = props;
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  useEffect((): void => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const [open, setOpen] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerType[]>([]);

  const getPlayers = async () => {
    const players = await getPlayersApi(teamId);
    setPlayers(players);
  };

  const onClose = (): void => {
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
            <Player key={player.id} player={player} index={index} update={getPlayers} isAdmin={adminView} />
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
};

export default Players;
