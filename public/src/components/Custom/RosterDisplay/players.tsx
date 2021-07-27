import React, { useContext, useEffect, useState } from 'react';
import { ListItem, ListItemIcon } from '@material-ui/core';
import { Avatar } from '..';

import RsvpItem from '../Roster/RsvpItem';

import { TeamPlayer } from '../../../../../typescript/types';
import { Store } from '../../../Store';
import { getEntityOwned } from '../../../actions/service/entity/get';
import { GLOBAL_ENUM } from '../../../../common/enums';
import router from 'next/router';

interface IProps {
  roster: TeamPlayer[];
  rosterId: string;
  update: () => void;
}

const Players: React.FunctionComponent<IProps> = (props) => {
  const {
    state: { userInfo },
  } = useContext(Store);

  const { gameId } = router.query;
  const { roster, rosterId, update } = props;

  const [teamRoster, setTeamRoster] = useState<TeamPlayer[]>();
  const [personList, setPersonList] = useState<string[]>();

  useEffect((): void => {
    if (roster) {
      setTeamRoster(roster);
      getPersons();
    }
  }, [roster]);

  const getPersons = async (): Promise<void> => {
    getEntityOwned(GLOBAL_ENUM.PERSON).then((res) => setPersonList(res.map((r) => r.id)));
  };

  return (
    <React.Fragment>
      {teamRoster?.map((player, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Avatar photoUrl={player.photoUrl} />
          </ListItemIcon>
          <RsvpItem
            player={player}
            personId={userInfo?.primaryPerson.personId}
            gameId={gameId.toString()}
            personList={personList}
            rosterId={rosterId}
            update={update}
          />
        </ListItem>
      ))}
    </React.Fragment>
  );
};

export default Players;
