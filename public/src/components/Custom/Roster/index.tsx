import React, { useEffect, useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { getIconFromRole, getInitialsFromName } from '../../../utils/stringFormats';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '../Icon';
import styles from './Roster.module.css';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../Avatar';
import { Player } from '../../../../../typescript/types';
import Rsvp from '../MyEventsTeam/Rsvp';
import { Store } from '../../../Store';
import { getEntityOwned } from '../../../actions/service/entity/get';
import RsvpItem from './RsvpItem';

interface IProps {
  roster?: Player[];
  practiceId: string;
}

const Roster: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { roster, practiceId } = props;
  const [teamRoster, setTeamRoster] = useState<Player[]>([]);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [personList, setPersonList] = useState<string[]>();

  useEffect((): void => {
    setTeamRoster(roster);
    getCurrentUserRsvp(roster);
    getPersons();
  }, [roster]);

  const {
    state: { userInfo },
  } = useContext(Store);

  const getCurrentUserRsvp = (roster: Player[]): void => {
    roster.forEach((player) => {
      if (player.personId == userInfo?.primaryPerson.personId) {
        setOpen(!player.rsvp);
      }
    });
  };

  const getPersons = async (): Promise<void> => {
    const data = await getEntityOwned(GLOBAL_ENUM.PERSON);

    const idPersonList: string[] = [];

    data.forEach((p) => {
      idPersonList.push(p.id);
    });
    setPersonList(idPersonList);
  };

  const setSelectedRsvp = (newRsvp: string): void => {
    setTeamRoster((teamRoster) => {
      return teamRoster.map((player) => ({
        ...player,
        rsvp: player.personId === userInfo?.primaryPerson.personId ? newRsvp : player.rsvp,
      }));
    });

    setOpen(false);
  };

  const hideRosterRsvp = (type: string, playerId: string): void => {
    setOpen(false);

    setTeamRoster((teamRoster) => {
      return teamRoster.map((player) => ({
        ...player,
        rsvp: player.personId === playerId ? type : player.rsvp,
      }));
    });
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <Typography className={styles.title} variant="h4">
        {t('roster')}
        <div>
          <Rsvp isOpen={isOpen} practiceId={practiceId} update={setSelectedRsvp} />
        </div>
      </Typography>
      {teamRoster.map((player: Player, index: number) => (
        <ListItem key={index} className={index % 2 === 0 ? styles.greycard : styles.card}>
          <ListItemIcon>
            <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
          </ListItemIcon>
          <div className={styles.position}>
            {player.role === ROSTER_ROLE_ENUM.PLAYER ? null : (
              <Tooltip
                title={t<string>(
                  player.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? 'assistant_captain' : player.role
                )}
              >
                <div>
                  <Icon icon={getIconFromRole(player.role)} />
                </div>
              </Tooltip>
            )}
          </div>
          <RsvpItem
            player={player}
            personId={userInfo?.primaryPerson.personId}
            practiceId={practiceId}
            personList={personList}
            update={hideRosterRsvp}
          />
        </ListItem>
      ))}
    </div>
  );
};

export default Roster;
