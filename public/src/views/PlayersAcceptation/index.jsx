import React from 'react';
import PlayersAndTeamsAcceptation from '../PlayersAndTeamsAcceptation';

export default function PlayersAcceptation(props) {
  const { cards } = props;
  return <PlayersAndTeamsAcceptation cards={cards} />;
}
