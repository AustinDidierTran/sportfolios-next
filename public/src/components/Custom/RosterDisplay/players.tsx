import { Chip, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '..';

import { TeamPlayer } from '../../../../../typescript/types';
// import { useOwnedPeopleIds } from '../../../hooks/entities';

interface IProps {
  roster: TeamPlayer[];
}

const Players = (props: IProps) => {
  const { roster } = props;

  const { t } = useTranslation();

  // const ownedPeopleIds = useOwnedPeopleIds();

  return (
    <React.Fragment>
      {roster.map((player, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Avatar photoUrl={player.photoUrl} />
          </ListItemIcon>
          <ListItemText primary={player.name} secondary={t(player.role)} />
          {/* TODO: Add RSVP to this! */}
        </ListItem>
      ))}
    </React.Fragment>
  );
};

export default Players;
