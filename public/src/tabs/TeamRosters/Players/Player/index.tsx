import React, { useState, useContext } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { formatRoute, getIconFromRole, getInitialsFromName } from '../../../../utils/stringFormats';
import styles from './Player.module.css';
import { FORM_DIALOG_TYPE_ENUM, ROSTER_ROLE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../components/Custom/Icon';
import AlertDialog from '../../../../components/Custom/Dialog/AlertDialog';
import FormDialog from '../../../../components/Custom/FormDialog';
import IconButton from '../../../../components/Custom/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '../../../../components/Custom/Avatar';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Player as PlayerType } from '../../../../../../typescript/types';

interface IProps {
  player: PlayerType;
  index: number;
  update: () => void;
  isAdmin: boolean;
}

const Player: React.FunctionComponent<IProps> = (props) => {
  const { player, index, update, isAdmin } = props;
  const { t } = useTranslation();

  const { dispatch } = useContext(Store);

  const [edit, setEdit] = useState<boolean>(false);
  const [deletePlayer, setDelete] = useState<boolean>(false);

  const onDelete = async ():Promise<void> => {
    const res = await api(
      formatRoute('/api/entity/player', null, {
        id: player.id,
      }),
      {
        method: 'DELETE',
      }
    );
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      setDelete(false);
    }
    update();
  };

  return (
    <ListItem className={index % 2 === 0 ? styles.greycard : styles.card}>
      <ListItemIcon>
        <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
      </ListItemIcon>
      <div className={styles.position}>
        {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
          <></>
        ) : (
          <Tooltip
            title={t<string>(player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role)}
          >
            <div>
              <Icon icon={getIconFromRole(player.role)} />
            </div>
          </Tooltip>
        )}
      </div>
      <ListItemText primary={player.name} />
      {isAdmin ? (
        <>
          <IconButton
            icon="Edit"
            style={{ color: 'primary', marginLeft: 'auto' }}
            onClick={() => {
              setEdit(true);
            }}
            tooltip={t('edit.edit')}
          />
          <IconButton
            icon="Delete"
            style={{ color: 'primary', marginLeft: 'auto' }}
            onClick={() => {
              setDelete(true);
            }}
            tooltip={t('remove')}
          />
          <AlertDialog
            open={deletePlayer}
            onCancel={() => {
              setDelete(false);
            }}
            title={t('remove_player_confirmation', { name: player.name })}
            onSubmit={onDelete}
          />
          <FormDialog
            type={FORM_DIALOG_TYPE_ENUM.EDIT_PLAYER}
            items={{
              open: edit,
              onClose: () => setEdit(false),
              player,
              update,
            }}
          />
        </>
      ) : (
        <></>
      )}
    </ListItem>
  );
};

export default Player;
