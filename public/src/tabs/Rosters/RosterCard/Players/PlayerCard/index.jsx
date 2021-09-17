import React, { useState, useMemo } from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import IconButton from '../../../../../components/Custom/IconButton';
import FormDialog from '../../../../../components/Custom/FormDialog';
import StatusChip from '../../../../../components/Custom/StatusChip';
import PersonInfoDialog from '../../../../../components/Custom/Dialog/PersonInfosDialog';
import api from '../../../../../actions/api';
import { formatRoute, getIconFromRole } from '../../../../../utils/stringFormats';
import Avatar from '../../../../../components/Custom/Avatar';
import { COLORS } from '../../../../../utils/colors';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';

export default function PlayerCard(props) {
  const {
    isEditable,
    player,
    onDelete,
    onRoleUpdate,
    withInfos,
    index,
    onPlayerAddToRoster,
    isAvailable,
    editableRoster = false,
  } = props;
  const { t } = useTranslation();
  const [playerInfos, setPlayerInfos] = useState(null);
  const [open, setOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const closePlayerAcceptation = () => {
    setOpen(false);
  };

  const openPlayerAcceptation = () => {
    setOpen(true);
  };

  const onPlayerAccept = () => {
    // eslint-disable-next-line
    console.log('accepting');
    // do things
    closePlayerAcceptation();
  };

  const onPlayerDecline = () => {
    // eslint-disable-next-line
    console.log('declining');
    // do things
    closePlayerAcceptation();
  };

  const getPersonInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/personInfos', null, {
        entityId: player.personId,
      }),
      { method: 'GET' }
    );
    setPlayerInfos(data);
  };

  const onAboutClick = async () => {
    await getPersonInfos();
    openPlayerAcceptation();
  };

  const handleRoleChange = async (newRole, playerId) => {
    onRoleUpdate(playerId, newRole);
  };

  const addToRoster = () => {
    const p = { id: player.personId };
    onPlayerAddToRoster(p);
  };

  if (editableRoster) {
    return (
      <div className={styles.card}>
        <div className={styles.player}>
          <Avatar className={styles.avatar} photoUrl={player.photoUrl} />
          <div className={styles.name}>
            <ListItemText
              primary={player.completeName ?? player.name}
              secondary={t(player.role ?? ROSTER_ROLE_ENUM.PLAYER)}
            />
          </div>
          <div className={styles.chip}>
            <StatusChip status={player.paymentStatus ?? player.status} />
          </div>
          <div className={styles.memberChip}>
            {player.isMember || player.isSub ? (
              <Chip label={t('member.member')} color="primary" variant="outlined" />
            ) : (
              <Chip label={t('member.not_member')} color="secondary" variant="outlined" />
            )}
          </div>
          {isEditable ? (
            <div className={styles.icon}>
              {withInfos ? (
                <IconButton icon="Info" style={{ color: COLORS.grey }} onClick={onAboutClick} tooltip={t('infos')} />
              ) : null}
              <IconButton
                onClick={() => setOpenOptions(true)}
                icon="Edit"
                style={{ color: COLORS.grey }}
                tooltip={t('edit.edit')}
              />
            </div>
          ) : null}
          {isAvailable ? (
            <div className={styles.add}>
              <IconButton onClick={addToRoster} icon="Add" style={{ color: COLORS.grey }} tooltip={t('add.add')} />
            </div>
          ) : null}
        </div>
        <PersonInfoDialog
          open={open}
          personInfos={playerInfos}
          id
          onClose={closePlayerAcceptation}
          onDecline={onPlayerDecline}
          onSubmit={onPlayerAccept}
        />
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.ROSTER_PLAYER_OPTIONS}
          items={{
            open: openOptions,
            onClose: () => setOpenOptions(false),
            onPlayerRemove: onDelete,
            onRoleUpdate: handleRoleChange,
            player,
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.player}>
        <Avatar className={styles.avatar} photoUrl={player.photoUrl} />
        <div className={styles.name}>
          <ListItemText
            primary={player.completeName ?? player.name}
            secondary={t(player.role ?? ROSTER_ROLE_ENUM.PLAYER)}
          />
        </div>
        <div className={styles.icon}>
          {withInfos ? (
            <IconButton icon="Info" style={{ color: COLORS.grey }} onClick={onAboutClick} tooltip={t('infos')} />
          ) : null}
        </div>
      </div>
      <PersonInfoDialog
        open={open}
        personInfos={playerInfos}
        id
        onClose={closePlayerAcceptation}
        onDecline={onPlayerDecline}
        onSubmit={onPlayerAccept}
        withoutButton
      />
    </div>
  );
}
