import React from 'react';
import PlayersAndTeamsAcceptation from '../PlayersAndTeamsAcceptation';

export default function PlayersAcceptation(props) {
  const { cards, update, getCards } = props;
  return <PlayersAndTeamsAcceptation cards={cards} update={update} getCards={getCards} />;
}
