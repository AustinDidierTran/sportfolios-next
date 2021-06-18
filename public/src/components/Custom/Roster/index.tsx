import React, { useEffect, useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { getIconFromRole, getInitialsFromName } from '../../../utils/stringFormats';

import Tooltip from '@material-ui/core/Tooltip';
import Icon from '../Icon';
import styles from './Roster.module.css';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../Avatar';
import { Player } from '../../../../../typescript/types';
import Rsvp from '../MyEventsTeam/Rsvp';
import { Store } from '../../../Store';
import Chip from '@material-ui/core/Chip';
import { getEntityOwned } from '../../../actions/service/entity';

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
    if (roster) {
      setTeamRoster(roster);
      getCurrentUserRsvp(roster);
      getPersons();
    }
  }, [props]);

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
    let data = await getEntityOwned(GLOBAL_ENUM.PERSON);

    let idPersonList:string[] = [];

    data.forEach((p) => {
      idPersonList.push(p.id)
    });
    setPersonList(idPersonList);
  };

  const setSelectedRsvp = (newRsvp: string): void => {
    teamRoster.forEach((player) => {
      if (player.personId == userInfo?.primaryPerson.personId) {
        player.rsvp = newRsvp;
      }
    });

    setTeamRoster([]);
    setTeamRoster([...teamRoster]);
  };

  const hideRosterRsvp = ():void => {
    setOpen(false);
  }

  return (
    <>
      <Typography className={styles.title} variant="h4">
        {t('roster')}
        <div>
        <Rsvp isOpen={isOpen} practiceId={practiceId} OnSetRsvp={setSelectedRsvp}/>
        </div>
      </Typography>
      {teamRoster.map((player: Player, index: number) => (
        <ListItem key={player.id} className={index % 2 === 0 ? styles.greycard : styles.card}>
          <ListItemIcon>
            <Avatar photoUrl={player.photoUrl} initials={getInitialsFromName(player.name)} />
          </ListItemIcon>
          <div className={styles.position}>
            {player.role === ROSTER_ROLE_ENUM.PLAYER ? (
              <></>
            ) : (
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
          <ListItemText primary={player.name} />
          {player.personId == userInfo?.primaryPerson.personId || personList?.includes(player.personId) ? (
            <Rsvp isOpen rsvpStatus={player.rsvp} practiceId={practiceId} playerId={player.personId} OnSetRsvp={hideRosterRsvp}/>
          ) : player.rsvp ? (
            <Chip label={t(player.rsvp)} color={player.rsvp == 'going' ? 'primary' : 'secondary'} variant="outlined" />
          ) : (
            <></>
          )}
        </ListItem>
      ))}
    </>
  );
};

export default Roster;
