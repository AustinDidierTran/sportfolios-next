import React, { useContext, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import Paper from '../../../components/Custom/Paper';
import Button from '../../../components/Custom/Button';
import FormDialog from '../../../components/Custom/FormDialog';
import { ACTION_ENUM, Store } from '../../../Store';
import { FORM_DIALOG_TYPE_ENUM, REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import styles from './Players.module.css';
import List from '@material-ui/core/List';
import Player from './Player';
import { Player as PlayerType } from '../../../../../typescript/types';
import { getPlayers as getPlayersApi } from '../../../actions/service/entity/get';
import { deletePlayer } from '../../../actions/service/entity/delete';
import { ERROR_ENUM } from '../../../../common/errors';
import { remainsOneCaptainOrCoach } from '../../../utils/validators';
import Typography from '@material-ui/core/Typography';

interface IProps {
  adminView: boolean;
}

const Players: React.FunctionComponent<IProps> = (props) => {
  const { adminView } = props;
  const { t } = useTranslation();
  const {
    state: { id: teamId },
  } = useContext(Store);

  const { dispatch } = useContext(Store);

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

  const onDelete = async (id: string) => {
    if (!remainsOneCaptainOrCoach(players, id)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }

    const status = await deletePlayer(id);
    if (status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
    getPlayers();
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
        ) : null}
        <List className={styles.list}>
          {players.length < 1 ? (
            <Typography color="textSecondary" style={{ margin: '16px' }}>
              {t('no.no_players')}
            </Typography>
          ) : (
            <>
              {players.map((player, index) => (
                <Player
                  key={player.id}
                  player={player}
                  index={index}
                  update={getPlayers}
                  onDelete={onDelete}
                  isAdmin={adminView}
                />
              ))}
            </>
          )}
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
