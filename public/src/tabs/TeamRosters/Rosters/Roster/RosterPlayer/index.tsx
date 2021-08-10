import React, { useState } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { getIconFromRole } from '../../../../../utils/stringFormats';
import styles from './RosterPlayer.module.css';
import { FORM_DIALOG_TYPE_ENUM, ROSTER_ROLE_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../components/Custom/Icon';
import AlertDialog from '../../../../../components/Custom/Dialog/AlertDialog';
import FormDialog from '../../../../../components/Custom/FormDialog';
import IconButton from '../../../../../components/Custom/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '../../../../../components/Custom/Avatar';
import { Player } from '../../../../../../../typescript/types';

interface IProps {
  index: number;
  isAdmin: boolean;
  update: () => void;
  player: Player;
  onDeletePlayer: (id: string) => void;
}

const RosterPlayer: React.FunctionComponent<IProps> = (props) => {
  const { player, index, update, isAdmin, onDeletePlayer } = props;
  const { t } = useTranslation();

  const [edit, setEdit] = useState<boolean>(false);
  const [deletePlayer, setDelete] = useState<boolean>(false);

  return (
    <ListItem className={index % 2 === 0 ? styles.greycard : styles.card}>
      <ListItemIcon>
        <Avatar photoUrl={player.photoUrl} />
      </ListItemIcon>
      <div className={styles.position}>
        {player.role === ROSTER_ROLE_ENUM.PLAYER ? null : (
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
            title={t('remove_roster_player_confirmation', { name: player.name })}
            onSubmit={() => {
              setDelete(false);
              onDeletePlayer(player.id);
            }}
          />
          <FormDialog
            type={FORM_DIALOG_TYPE_ENUM.EDIT_ROSTER_PLAYER}
            items={{
              open: edit,
              onClose: () => setEdit(false),
              player,
              update,
            }}
          />
        </>
      ) : null}
    </ListItem>
  );
};
export default RosterPlayer;
