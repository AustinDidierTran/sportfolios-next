import React from 'react';

import List from '@material-ui/core/List';
import Player from './Player';

export default function Players(props) {
  const { players, update, isAdmin } = props;

  return (
    <List>
      {players.map((player, index) => (
        <Player player={player} index={index} key={player.id} update={update} isAdmin={isAdmin} />
      ))}
    </List>
  );
}
