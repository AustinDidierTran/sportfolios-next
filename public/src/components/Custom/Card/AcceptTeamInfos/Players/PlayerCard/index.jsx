import React, { useState, useMemo } from 'react';
import styles from './PlayerCard.module.css';
import { ROSTER_ROLE_ENUM } from '../../../../../../../common/enums';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import PersonInfoDialog from '../../../../Dialog/PersonInfosDialog';
import api from '../../../../../../actions/api';
import { formatRoute } from '../../../../../../../common/utils/stringFormat';
import Icon from '../../../../Icon';
import IconButton from '../../../../IconButton';

export default function PlayerCard(props) {
  const { player, index } = props;
  const { t } = useTranslation();
  const [playerInfos, setPlayerInfos] = useState(null);
  const [open, setOpen] = useState(false);

  const closePlayerAcceptation = () => {
    setOpen(false);
  };

  const openPlayerAcceptation = () => {
    setOpen(true);
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

  const getIconFromRole = (role) => {
    switch (role) {
      case ROSTER_ROLE_ENUM.COACH:
        return 'SportsWhistle';
      case ROSTER_ROLE_ENUM.CAPTAIN:
        return 'Stars';
      case ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN:
        return 'TextFormat';
      default:
        return 'Person';
    }
  };

  const className = useMemo(() => {
    if (index % 2 === 0) {
      return styles.card;
    } else {
      return styles.greycard;
    }
  }, [index]);

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
          <IconButton icon="Info" style={{ color: 'grey' }} onClick={onAboutClick} tooltip={t('infos')} />
        </div>
      </div>
      <PersonInfoDialog open={open} personInfos={playerInfos} id onClose={closePlayerAcceptation} withoutButton />
    </div>
  );
}
