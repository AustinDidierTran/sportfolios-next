import React, { useContext, useEffect, useMemo, useState } from 'react';

import styles from './Players.module.css';
import { useTranslation } from 'react-i18next';
import PlayerCard from './PlayerCard';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { LoadingSpinner, PersonSearchList } from '../../../../components/Custom';
import api from '../../../../actions/api';
import PersonsQuickAdd from './PersonsQuickAdd';
import { Store } from '../../../../Store';
import RosterInviteLink from '../RosterInviteLink';
import { ROSTER_ROLE_ENUM } from '../../../../../common/enums';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function Players(props) {
  const { t } = useTranslation();
  const {
    editableRole,
    editableRoster,
    whiteList,
    withMyPersonsQuickAdd,
    players,
    rosterId,
    onDelete,
    onAdd,
    onRoleUpdate,
    withPlayersInfos,
  } = props;
  const [blackList, setBlackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    getBlackList();
  }, [rosterId, editableRoster, withMyPersonsQuickAdd]);

  const getBlackList = async () => {
    if (!(editableRoster || withMyPersonsQuickAdd)) {
      return;
    }
    setIsLoading(true);
    const { data } = await api(
      formatRoute('/api/entity/getRoster', null, {
        rosterId,
        withSub: true,
      })
    );
    setBlackList(data.map((d) => d.personId));
    setIsLoading(false);
  };

  const onPlayerAddToRoster = async (person) => {
    setIsLoading(true);
    const player = {
      personId: person.id,
      role: ROSTER_ROLE_ENUM.PLAYER,
      isSub: false,
    };

    await onAdd(player, rosterId);
    setBlackList([...blackList, player.personId]);
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    await onDelete(id);
    //TODO: handle blacklist in frontend and backend
    await getBlackList();
    setIsLoading(false);
  };

  const handleRoleUpdate = async (playerId, role) => {
    setIsLoading(true);
    await onRoleUpdate(playerId, role);
    setIsLoading(false);
  };
  const playersQuickAdd = useMemo(() => {
    if (!withMyPersonsQuickAdd) {
      return;
    }
    const mapFunction = (p) => ({
      ...p,
      photoUrl: p.photo_url,
      teamPlayerId: players.find((q) => p.entity_id === q.personId)?.id,
    });

    if (!whiteList) {
      return userInfo.persons.map(mapFunction);
    }
    return userInfo.persons.filter((p) => whiteList.includes(p.entity_id)).map(mapFunction);
  }, [players, withMyPersonsQuickAdd, whiteList]);

  const playersSortingFunction = (a, b) => {
    if (a.entity_id === userInfo.primaryPerson.entity_id) {
      return -1;
    }
    if (b.entity_id === userInfo.primaryPerson.entity_id) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (!players) {
    return null;
  }
  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  if (editableRoster) {
    return (
      <div className={styles.card}>
        <Typography className={styles.listTitle} variant="h6">
          {t('add_players')}
        </Typography>
        <Divider className={styles.divider} />
        <div className={styles.searchList}>
          <PersonSearchList
            blackList={blackList}
            whiteList={whiteList}
            label={t('enter_player_name')}
            onClick={onPlayerAddToRoster}
            secondary={t('player')}
            withoutIcon
            autoFocus
            rosterId={rosterId}
          />
        </div>
        <RosterInviteLink rosterId={rosterId} />
        <PersonsQuickAdd
          title={t('my_persons')}
          titleClassName={styles.listTitle}
          onAdd={onPlayerAddToRoster}
          persons={playersQuickAdd}
          onRemove={handleDelete}
          personsSortingFunction={playersSortingFunction}
        />
        {players.length ? (
          <div className={styles.player}>
            <Typography className={styles.listTitle} variant="h6">
              {t('roster')}
            </Typography>
            <Divider className={styles.divider} />
            {players.map((player, index) => (
              <PlayerCard
                index={index}
                player={player}
                isEditable={editableRole}
                onDelete={handleDelete}
                onRoleUpdate={handleRoleUpdate}
                key={player.id}
              />
            ))}
          </div>
        ) : (
          <Typography>{t('empty_roster')}</Typography>
        )}
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <PersonsQuickAdd
        title={t('my_persons')}
        titleClassName={styles.listTitle}
        onAdd={onPlayerAddToRoster}
        persons={playersQuickAdd}
        onRemove={handleDelete}
        personsSortingFunction={playersSortingFunction}
      />
      <Typography className={styles.listTitle} variant="h6">
        {t('roster')}
      </Typography>
      <Divider className={styles.divider} />
      {
        <>
          {players.length ? (
            <div className={styles.player}>
              {players.map((player, index) => {
                return (
                  <PlayerCard
                    index={index}
                    player={player}
                    isEditable={editableRole}
                    onDelete={handleDelete}
                    onRoleUpdate={handleRoleUpdate}
                    withInfos={withPlayersInfos}
                    key={player.id}
                  />
                );
              })}
            </div>
          ) : (
            <Typography>{t('empty_roster')}</Typography>
          )}
        </>
      }
    </div>
  );
}
