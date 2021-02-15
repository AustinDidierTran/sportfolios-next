import React from 'react';

import PlayersAndTeamsAcceptation from '../PlayersAndTeamsAcceptation';

export default function TeamsAcceptation(props) {
  const { cards, update } = props;

  return <PlayersAndTeamsAcceptation cards={cards} update={update} />;
}
