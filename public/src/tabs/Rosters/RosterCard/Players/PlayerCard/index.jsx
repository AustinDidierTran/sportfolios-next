import React, { useState, useMemo } from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../../../common/enums';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import IconButton from '../../../../../components/Custom/IconButton';
import FormDialog from '../../../../../components/Custom/FormDialog';
import Icon from '../../../../../components/Custom/Icon';
import PersonInfoDialog from '../../../../../components/Custom/Dialog/PersonInfosDialog';
import api from '../../../../../actions/api';
import PaymentChip from '../../../../Settings/TeamsRegistered/StatusChip';
import { formatRoute, getIconFromRole } from '../../../../../utils/stringFormats';

export default function PlayerCard(props) {
  const { isEditable, player, onDelete, onRoleUpdate, withInfos, index } = props;
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
      })
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

  const className = useMemo(() => {
    if (index % 2 === 0) {
      return styles.card;
    } else {
      return styles.greycard;
    }
  }, [index]);

  if (isEditable) {
    return (
      <div className={className}>
        <div className={styles.player}>
          <div className={styles.position}>
            {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
              <></>
            ) : (
              <Tooltip
                title={t(player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role)}
              >
                <div>
                  <Icon icon={getIconFromRole(player.role)} />
                </div>
              </Tooltip>
            )}
          </div>
          <div className={styles.name}>
            <Typography>{player && player.name}</Typography>
          </div>
          <div className={styles.chip}>
            <PaymentChip status={player.paymentStatus} />
          </div>
          <div className={styles.icon}>
            {withInfos ? (
              <IconButton icon="Info" style={{ color: 'grey' }} onClick={onAboutClick} tooltip={t('infos')} />
            ) : (
              <></>
            )}
            <IconButton
              onClick={() => setOpenOptions(true)}
              icon="Edit"
              style={{ color: 'grey' }}
              tooltip={t('edit.edit')}
            />
          </div>
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
    <div className={className}>
      <div className={styles.player}>
        <div className={styles.position}>
          {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
            <></>
          ) : (
            <Tooltip title={t(player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role)}>
              <div>
                <Icon icon={getIconFromRole(player.role)} />
              </div>
            </Tooltip>
          )}
        </div>
        <div className={styles.name}>
          <Typography>{player && player.name}</Typography>
        </div>
        <div className={styles.icon}>
          {withInfos ? (
            <IconButton icon="Info" style={{ color: 'grey' }} onClick={onAboutClick} tooltip={t('infos')} />
          ) : (
            <></>
          )}
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
