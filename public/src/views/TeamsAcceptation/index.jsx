import React from 'react';
import dynamic from 'next/dynamic';

const PlayersAndTeamsAcceptation = dynamic(() => import('../PlayersAndTeamsAcceptation'));

export default function TeamsAcceptation(props) {
  const { cards, update, getCards } = props;

  return <PlayersAndTeamsAcceptation cards={cards} update={update} getCards={getCards} />;
}
